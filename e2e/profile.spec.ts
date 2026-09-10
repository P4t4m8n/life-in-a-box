import { test, expect } from "@playwright/test";

test.describe("profile page (guest)", () => {
  test("redirects to login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("profile page (approved member)", () => {
  test.use({ storageState: "e2e/.auth/member.json" });

  test("shows the member's name, email and status", async ({ page }) => {
    await page.goto("/profile");

    await expect(
      page.getByRole("heading", { name: "E2E Member" }),
    ).toBeVisible();
    await expect(page.getByText("member@e2e.test")).toBeVisible();
    await expect(page.getByText("מאושר")).toBeVisible();
    await expect(page.getByText("משתמש")).toBeVisible();
  });
});

test.describe("profile page (pending member)", () => {
  test.use({ storageState: "e2e/.auth/pending.json" });

  test("shows the pending status and waiting message", async ({ page }) => {
    await page.goto("/profile");

    await expect(
      page.getByText("ממתין לאישור", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("ממתין לאישור, נעדכן שהקופסא תתפנה"),
    ).toBeVisible();
  });
});
