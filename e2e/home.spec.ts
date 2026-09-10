import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("shows the hero and only published, public posts", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "החיים בקופסא" }),
    ).toBeVisible();

    await expect(page.getByText("פוסט ציבורי לבדיקות")).toBeVisible();

    // draft/archived posts must never leak into the public homepage. The member-only
    // post's title IS expected here — PrivateSection intentionally teases it to guests.
    await expect(page.getByText("טיוטה שלא אמורה להופיע")).toHaveCount(0);
    await expect(
      page.getByText("פוסט בארכיון שלא אמור להופיע"),
    ).toHaveCount(0);
  });
});
