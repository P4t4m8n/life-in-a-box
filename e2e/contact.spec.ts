import { test, expect } from "@playwright/test";

test.describe("contact form", () => {
  test("blocks submission until required fields are valid", async ({
    page,
  }) => {
    await page.goto("/contact");

    const submit = page.getByRole("button", { name: "שליחה" });
    await submit.click();

    // native HTML5 validation should block submission — no success/error state renders
    await expect(page.getByText("ההודעה נשלחה בהצלחה!")).toHaveCount(0);
    await expect(page.getByLabel("שם")).toHaveJSProperty(
      "validity.valid",
      false,
    );
  });

  test("rejects a malformed email address", async ({ page }) => {
    await page.goto("/contact");

    await page.getByLabel("שם").fill("בודק");
    await page.getByLabel("אימייל").fill("not-an-email");
    await page.getByLabel("נושא").fill("נושא לדוגמה");
    await page.getByLabel("הודעה").fill("תוכן ההודעה לבדיקה");
    await page.getByRole("button", { name: "שליחה" }).click();

    await expect(page.getByLabel("אימייל")).toHaveJSProperty(
      "validity.valid",
      false,
    );
  });
});
