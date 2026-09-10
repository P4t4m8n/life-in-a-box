# החיים בקופסא (Life in a Box)

A personal, Hebrew-language (RTL) blog built on Next.js 16. Supports public posts, a
member-only tier gated behind Google sign-in, an admin dashboard for authoring/moderation,
and a contact form — all backed by Postgres via Prisma.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.2 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, Radix UI / Base UI primitives, lucide-react icons |
| Rich text | TipTap 3 (editor + static React renderer for read view) |
| Auth | NextAuth v4, Google OAuth provider, JWT session strategy |
| Database | PostgreSQL, Prisma ORM 7 (`prisma-client` generator, custom output at `generated/prisma`), `@prisma/adapter-pg` driver adapter |
| Email | Nodemailer (Gmail, OAuth2 auth) |
| Images | Cloudinary (signed server-side uploads) |
| E2E tests | Playwright |


## Data model

Defined in [`prisma/schema.prisma`](prisma/schema.prisma):

- **`Post`** — `status` (`DRAFT` / `PUBLISHED` / `ARCHIVED`) × `accessLevel` (`PUBLIC` / `USER` / `PRIVATE`) control visibility. Content is stored as TipTap's ProseMirror JSON document (`content: Json`), not raw HTML.
- **`User`** — `role` (`USER` / `ADMIN`) and `status` (`PENDING` / `APPROVED` / `REJECTED` / `BANNED`); created on first Google sign-in.
- **`Tag`**, **`Category`** — many-to-many / one-to-many post taxonomy.
- **`MainPost`**, **`MainMemberPost`**, **`RecommendedPost`** — singleton "pin" tables the admin dashboard uses to feature specific posts on the homepage (public main post, member-teaser post, and a recommended post), each FK'd to `Post`.

## Authentication & authorization

- Sign-in is Google OAuth only (no passwords). On first sign-in a `User` row is created with `role: USER, status: PENDING`; the account matching `ADMIN_EMAIL` is auto-promoted to `role: ADMIN, status: APPROVED` on every sign-in.
- The `jwt` callback in [`lib/auth.ts`](lib/auth.ts) re-reads `role`/`status` from the database on every request, so a role change (or a ban) takes effect immediately without waiting for the JWT to expire.
- **`/admin/*`** is gated by [`proxy.ts`](proxy.ts): no session → redirect to `/login`; session but not an admin → redirect to `/pending-approval`.
- **Member-only posts** are gated inside `getPostById` (`lib/actions/post-actions.ts`): not an approved member → redirect to `/login`; draft/archived/private posts → `404` for everyone but admins.
- Every mutating server action also calls `requireAdmin()` itself as defense-in-depth, independent of route-level checks.

## Project structure

```
app/
  (root)/
    (home)/       homepage (main post, member-teaser, recommended post)
    posts/        public post listing + detail page
    admin/        parallel-routed dashboard (@posts, @users, @editor tabs)
    contact/      contact form page
    login/, pending-approval/, profile/
  api/auth/       NextAuth route handler
lib/
  actions/        server actions (posts, admin controls, tags, users, uploads, contact)
  auth.ts         NextAuth config + requireAdmin() guard
  prisma.ts       Prisma client singleton (PrismaPg adapter)
  rate-limit.ts   Postgres-backed rate limiter
components/       UI components, incl. TipTap editor (components/TipTap/)
prisma/           schema + migrations
e2e/              Playwright tests, DB seed/reset helpers, auth-bypass helper
```

## Security notes

- **Headers**: `next.config.ts` sets a CSP, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, and HSTS on every route.
- **Rate limiting**: the contact form is capped at 5 submissions/hour per IP via
  `lib/rate-limit.ts`. Backed by a `RateLimitBucket` Postgres table (single atomic
  upsert per check) rather than an in-memory counter, since the app runs on
  serverless infrastructure where separate instances/cold starts don't share memory.
- **Pagination**: `Post` has indexes on `(status, accessLevel)` and `createdAt`.
  `/posts` and the admin posts table page through results (`getPublicPosts`/
  `getAdminPosts` take `page`/`pageSize`) instead of loading every row.
- **Uploads**: `uploadImageToCloudinary` requires an admin session and rejects
  non-image / oversized files before signing the Cloudinary request.
- Prisma parameterizes all queries, so none of the above is standing in for SQL-injection
  protection — it isn't needed here.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` with:
   ```
   DATABASE_URL=            # pooled Postgres connection
   DIRECT_URL=               # direct (session-mode) connection, used for migrations
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_REFRESH_TOKEN=     # Gmail OAuth2 refresh token, for sending contact-form email
   NEXTAUTH_SECRET=
   ADMIN_EMAIL=              # Google account promoted to admin on sign-in
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   EMAIL_USER=               # Gmail address the contact form sends from/to
   ```
3. Run migrations and generate the client:
   ```bash
   npm run migrate
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` / `npm run start` | Production build / start |
| `npm run lint` | ESLint |
| `npm run migrate` | `prisma migrate dev` |
| `npm run gen` | `prisma generate` |
| `npm run studio` | Open Prisma Studio |
| `npm run test:e2e` | Run the Playwright suite |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:report` | Open the last HTML test report |

## Testing

End-to-end coverage lives in [`e2e/`](e2e/) and runs against an isolated `box-db-test`
database (config in `.env.test`), never the dev database. Auth is bypassed by seeding real
`User` rows and forging a valid NextAuth session-token JWT (`e2e/auth.ts`) — no real Google
OAuth flow runs in tests. Suites cover:

- public homepage/listing filtering (drafts/archived never leak out)
- member-post access gating (guest → login redirect, member → allowed)
- admin route protection (guest → login, non-admin → pending-approval, admin → allowed)
- contact form client-side validation

Run with `npm run test:e2e`.
