import { test, expect } from "@playwright/test";

test.describe("about page", () => {
  test("shows the intro heading and topics", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { name: "החיים בקופסא" }),
    ).toBeVisible();
    await expect(page.getByText("קצת עליי")).toBeVisible();
  });
});
