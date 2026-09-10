import { test, expect } from "@playwright/test";

test.describe("pending-approval page (guest)", () => {
  test("redirects to login", async ({ page }) => {
    await page.goto("/pending-approval");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("pending-approval page (pending member)", () => {
  test.use({ storageState: "e2e/.auth/pending.json" });

  test("shows the waiting-for-approval message", async ({ page }) => {
    await page.goto("/pending-approval");

    await expect(
      page.getByRole("heading", { name: "בודק אם יש קופסא פנויה" }),
    ).toBeVisible();
  });
});
