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
});
