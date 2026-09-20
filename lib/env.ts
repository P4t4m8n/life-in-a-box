// Fails fast on missing configuration instead of surfacing as a runtime 500 later.
const required = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "ADMIN_EMAIL",
] as const;

// Only needed for a real production deploy, not for local dev / CI / preview builds.
const productionOnly = ["NEXT_PUBLIC_SITE_URL", "CRON_SECRET"] as const;

const missing = [
  ...required,
  ...(process.env.VERCEL_ENV === "production" ? productionOnly : []),
].filter((name) => !process.env[name]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
};
