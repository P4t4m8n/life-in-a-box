import { test, expect } from "@playwright/test";

test.describe("admin area (guest)", () => {
  test("redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("admin area (approved non-admin member)", () => {
  test.use({ storageState: "e2e/.auth/member.json" });

  test("redirects to pending-approval", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/pending-approval/);
  });
});

test.describe("admin area (admin)", () => {
  test.use({ storageState: "e2e/.auth/admin.json" });

  test("can view the posts management dashboard", async ({ page }) => {
    await page.goto("/admin/posts");

    await expect(
      page.getByRole("heading", { name: "ניהול פוסטים" }),
    ).toBeVisible();
    await expect(page.getByText("פוסט ציבורי לבדיקות")).toBeVisible();
    // admins should see everything here, including drafts/archived
    await expect(page.getByText("טיוטה שלא אמורה להופיע")).toBeVisible();
    await expect(
      page.getByText("פוסט בארכיון שלא אמור להופיע"),
    ).toBeVisible();
  });
});
