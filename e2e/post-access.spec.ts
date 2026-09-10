import { test, expect } from "@playwright/test";
import { findPostByTitle } from "./db";

test.describe("post access (guest)", () => {
  test("redirects to login for a member-only post", async ({ page }) => {
    const post = await findPostByTitle("פוסט לחברים בלבד");

    await page.goto(`/posts/${post.id}`);
    await expect(page).toHaveURL(/\/login/);
  });

  test("returns 404 for a draft post", async ({ page }) => {
    const post = await findPostByTitle("טיוטה שלא אמורה להופיע");

    const response = await page.goto(`/posts/${post.id}`);
    expect(response?.status()).toBe(404);
  });

  test("returns 404 for an archived post", async ({ page }) => {
    const post = await findPostByTitle("פוסט בארכיון שלא אמור להופיע");

    const response = await page.goto(`/posts/${post.id}`);
    expect(response?.status()).toBe(404);
  });
});

test.describe("post access (approved member)", () => {
  test.use({ storageState: "e2e/.auth/member.json" });

  test("can view a member-only post", async ({ page }) => {
    const post = await findPostByTitle("פוסט לחברים בלבד");

    await page.goto(`/posts/${post.id}`);
    await expect(
      page.getByRole("heading", { name: post.title }),
    ).toBeVisible();
  });
});
