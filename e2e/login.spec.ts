import { test, expect } from "@playwright/test";

test.describe("login page (guest)", () => {
  test("shows the Google sign-in button", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "כניסה עם חשבון Google" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "המשך עם Google" }),
    ).toBeVisible();
  });
});

test.describe("login page (already authenticated)", () => {
  test.use({ storageState: "e2e/.auth/member.json" });

  test("redirects away from login", async ({ page }) => {
    await page.goto("/login");

    await expect(page).not.toHaveURL(/\/login/);
  });
});
