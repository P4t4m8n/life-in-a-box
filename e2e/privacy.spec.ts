import { test, expect } from "@playwright/test";

test.describe("privacy page", () => {
  test("shows the privacy policy, terms, and contact link", async ({ page }) => {
    await page.goto("/privacy");

    await expect(
      page.getByRole("heading", { name: "מדיניות פרטיות ותנאי שימוש" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "מדיניות פרטיות", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "תנאי שימוש", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "טופס יצירת הקשר" }).first(),
    ).toHaveAttribute("href", "/contact");
  });
});