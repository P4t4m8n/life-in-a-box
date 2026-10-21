import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { expect, test } from "@playwright/test";
import { Role, UserStatus } from "@/generated/prisma/enums";
import { createSessionCookie } from "./auth";
import { BASE_URL } from "./constants";

type TestUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
};

async function withTestDb<T>(callback: (client: Client) => Promise<T>) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    return await callback(client);
  } finally {
    await client.end();
  }
}

async function createTestUser(): Promise<TestUser> {
  const id = randomUUID();
  const user: TestUser = {
    id,
    email: `account-delete-${id}@e2e.test`,
    name: `Delete Test ${id}`,
    role: Role.USER,
    status: UserStatus.APPROVED,
  };

  await withTestDb((client) =>
    client.query(
      `INSERT INTO "User" (id, email, name, role, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, now(), now())`,
      [user.id, user.email, user.name, user.role, user.status],
    ),
  );

  return user;
}

async function userExists(id: string) {
  return withTestDb(async (client) => {
    const result = await client.query(
      'SELECT EXISTS(SELECT 1 FROM "User" WHERE id = $1) AS exists',
      [id],
    );
    return result.rows[0].exists as boolean;
  });
}

async function removeTestUser(id: string) {
  await withTestDb((client) =>
    client.query('DELETE FROM "User" WHERE id = $1', [id]),
  );
}

async function signInAs(page: import("@playwright/test").Page, user: TestUser) {
  await page.context().addCookies([
    await createSessionCookie(user, BASE_URL),
  ]);
}

test.describe("account deletion by the account owner", () => {
  test("deletes only the signed-in user's account after confirmation", async ({
    page,
  }) => {
    const owner = await createTestUser();
    const other = await createTestUser();

    try {
      await signInAs(page, owner);
      await page.goto("/profile");
      await expect(
        page.getByRole("button", { name: "מחיקת החשבון שלי" }),
      ).toBeVisible();

      page.once("dialog", (dialog) => dialog.dismiss());
      await page.getByRole("button", { name: "מחיקת החשבון שלי" }).click();
      expect(await userExists(owner.id)).toBe(true);

      page.once("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "מחיקת החשבון שלי" }).click();
      await expect(page).toHaveURL(`${BASE_URL}/`);
      await expect.poll(() => userExists(owner.id)).toBe(false);
      expect(await userExists(other.id)).toBe(true);
    } finally {
      await removeTestUser(owner.id);
      await removeTestUser(other.id);
    }
  });

  test("a regular user cannot open admin account management", async ({
    page,
  }) => {
    const owner = await createTestUser();
    const other = await createTestUser();

    try {
      await signInAs(page, owner);
      await page.goto("/admin/users");
      await expect(page).toHaveURL(/\/pending-approval/);
      expect(await userExists(other.id)).toBe(true);

      await page.goto("/profile");
      await expect(
        page.getByRole("button", { name: "מחיקת החשבון שלי" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "מחיקת חשבון", exact: true }),
      ).toHaveCount(0);
    } finally {
      await removeTestUser(owner.id);
      await removeTestUser(other.id);
    }
  });
});

test.describe("account deletion by an admin", () => {
  test.use({ storageState: "e2e/.auth/admin.json" });

  test("deletes another user's account and revokes their existing session", async ({
    page,
    browser,
  }) => {
    const target = await createTestUser();
    const targetContext = await browser.newContext();

    try {
      const targetPage = await targetContext.newPage();
      await signInAs(targetPage, target);
      await targetPage.goto("/profile");
      await expect(targetPage.getByText(target.email)).toBeVisible();

      await page.goto("/admin/users");
      const targetRow = page.getByRole("row").filter({ hasText: target.email });
      await expect(targetRow).toBeVisible();

      page.once("dialog", (dialog) => dialog.accept());
      await targetRow
        .getByRole("button", { name: "מחיקת חשבון" })
        .click();

      await expect(targetRow).toHaveCount(0);
      await expect.poll(() => userExists(target.id)).toBe(false);

      await targetPage.goto("/profile");
      await expect(targetPage).toHaveURL(/\/login/);
    } finally {
      await targetContext.close();
      await removeTestUser(target.id);
    }
  });
});