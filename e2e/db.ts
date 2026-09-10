import { randomUUID } from "crypto";
import { Client } from "pg";

// Raw `pg` client, deliberately avoiding the generated Prisma client here:
// Prisma 7's generated client is ESM-only (`import.meta`), which Playwright's
// CJS-based TS transform for config/globalSetup files can't load.
export const testDb = new Client({ connectionString: process.env.DATABASE_URL });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@e2e.test";
const MEMBER_EMAIL = "member@e2e.test";
const PENDING_EMAIL = "pending@e2e.test";

const emptyDoc = JSON.stringify({ type: "doc", content: [] });

export async function resetDatabase() {
  await testDb.query('DELETE FROM "MainPost"');
  await testDb.query('DELETE FROM "MainMemberPost"');
  await testDb.query('DELETE FROM "RecommendedPost"');
  await testDb.query('DELETE FROM "_PostToTag"');
  await testDb.query('DELETE FROM "Post"');
  await testDb.query('DELETE FROM "Tag"');
  await testDb.query('DELETE FROM "User"');
}

async function createUser(data: {
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  status: "APPROVED" | "PENDING";
}) {
  const id = randomUUID();
  await testDb.query(
    `INSERT INTO "User" (id, email, name, role, status, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, now(), now())`,
    [id, data.email, data.name, data.role, data.status],
  );
  return { id, ...data };
}

async function createPost(data: {
  title: string;
  description?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  accessLevel: "PUBLIC" | "USER" | "PRIVATE";
}) {
  const id = randomUUID();
  await testDb.query(
    `INSERT INTO "Post" (id, title, description, content, status, "accessLevel", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, now(), now())`,
    [id, data.title, data.description ?? null, emptyDoc, data.status, data.accessLevel],
  );
  return { id, ...data };
}

export async function seedDatabase() {
  const admin = await createUser({
    email: ADMIN_EMAIL,
    name: "E2E Admin",
    role: "ADMIN",
    status: "APPROVED",
  });

  const member = await createUser({
    email: MEMBER_EMAIL,
    name: "E2E Member",
    role: "USER",
    status: "APPROVED",
  });

  const pending = await createUser({
    email: PENDING_EMAIL,
    name: "E2E Pending",
    role: "USER",
    status: "PENDING",
  });

  const publicPost = await createPost({
    title: "פוסט ציבורי לבדיקות",
    description: "פוסט לדוגמה שגלוי לכולם",
    status: "PUBLISHED",
    accessLevel: "PUBLIC",
  });

  const memberPost = await createPost({
    title: "פוסט לחברים בלבד",
    description: "פוסט לדוגמה לחברים מאושרים",
    status: "PUBLISHED",
    accessLevel: "USER",
  });

  const draftPost = await createPost({
    title: "טיוטה שלא אמורה להופיע",
    status: "DRAFT",
    accessLevel: "PUBLIC",
  });

  const archivedPost = await createPost({
    title: "פוסט בארכיון שלא אמור להופיע",
    status: "ARCHIVED",
    accessLevel: "PUBLIC",
  });

  return { admin, member, pending, publicPost, memberPost, draftPost, archivedPost };
}

// Spec files run in their own worker process, separate from the one globalSetup
// ran in — so rather than share a single long-lived `testDb` connection across
// processes, open a short-lived connection per lookup.
export async function findPostByTitle(title: string) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const result = await client.query(
      'SELECT id, title FROM "Post" WHERE title = $1 LIMIT 1',
      [title],
    );
    if (result.rows.length === 0) {
      throw new Error(`No post found with title "${title}"`);
    }
    return result.rows[0] as { id: string; title: string };
  } finally {
    await client.end();
  }
}
