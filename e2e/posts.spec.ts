import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { test, expect } from "@playwright/test";

test.describe("posts listing", () => {
  test("guest sees only published, public posts", async ({ page }) => {
    await page.goto("/posts");

    await expect(page.getByText("פוסט ציבורי לבדיקות")).toBeVisible();
    await expect(page.getByText("פוסט לחברים בלבד")).toHaveCount(0);
    await expect(page.getByText("טיוטה שלא אמורה להופיע")).toHaveCount(0);
    await expect(
      page.getByText("פוסט בארכיון שלא אמור להופיע"),
    ).toHaveCount(0);
  });

  test("orders published posts by their last update", async ({ page }) => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    const suffix = randomUUID();
    const olderId = randomUUID();
    const newerId = randomUUID();
    const olderTitle = `Sort test ${suffix} older`;
    const newerTitle = `Sort test ${suffix} newer`;
    const search = new URLSearchParams({ q: suffix });

    await client.connect();
    try {
      await client.query(
        `INSERT INTO "Post" (id, title, content, status, "accessLevel", "createdAt", "updatedAt")
         VALUES ($1, $2, $3::jsonb, 'PUBLISHED', 'PUBLIC', '2000-01-01', '2100-01-01'),
                ($4, $5, $3::jsonb, 'PUBLISHED', 'PUBLIC', '2001-01-01', '2101-01-01')`,
        [olderId, olderTitle, JSON.stringify({ type: "doc", content: [] }), newerId, newerTitle],
      );

      await page.goto(`/posts?${search}`, { waitUntil: "domcontentloaded" });
      const postLinks = page.locator(
        `a[href="/posts/${olderId}"], a[href="/posts/${newerId}"]`,
      );
      await expect(postLinks).toHaveCount(2);
      await expect(postLinks.nth(0)).toHaveAttribute("href", `/posts/${newerId}`);
      await expect(postLinks.nth(1)).toHaveAttribute("href", `/posts/${olderId}`);

      await client.query(
        'UPDATE "Post" SET "updatedAt" = $1 WHERE id = $2',
        [new Date("2102-01-01T00:00:00Z"), olderId],
      );

      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(postLinks.nth(0)).toHaveAttribute("href", `/posts/${olderId}`);
      await expect(postLinks.nth(1)).toHaveAttribute("href", `/posts/${newerId}`);

      await page.goto(`/posts?${search}&sort=oldest`, {
        waitUntil: "domcontentloaded",
      });
      await expect(postLinks.nth(0)).toHaveAttribute("href", `/posts/${newerId}`);
      await expect(postLinks.nth(1)).toHaveAttribute("href", `/posts/${olderId}`);

      await page.goto("/", { waitUntil: "domcontentloaded" });
      const recentLinks = page.locator(
        `#latest a[href="/posts/${olderId}"], #latest a[href="/posts/${newerId}"]`,
      );
      await expect(recentLinks).toHaveCount(2);
      await expect(recentLinks.nth(0)).toHaveAttribute("href", `/posts/${olderId}`);
      await expect(recentLinks.nth(1)).toHaveAttribute("href", `/posts/${newerId}`);
    } finally {
      await client.query('DELETE FROM "Post" WHERE id = ANY($1::text[])', [
        [olderId, newerId],
      ]);
      await client.end();
    }
  });
});
