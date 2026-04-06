import { test, expect } from "@playwright/test";

test.describe("Dark/Light Mode Toggle", () => {
  test("page has a data-theme attribute on <html>", async ({ page }) => {
    await page.goto("/");
    const theme = await page.locator("html").getAttribute("data-theme");
    expect(["light", "dark"]).toContain(theme);
  });

  test("clicking theme toggle switches between light and dark", async ({
    page,
  }) => {
    await page.goto("/");
    const html = page.locator("html");
    const themeBefore = await html.getAttribute("data-theme");

    await page.locator("#theme-btn").click();

    const themeAfter = await html.getAttribute("data-theme");
    expect(themeAfter).not.toEqual(themeBefore);
    expect(["light", "dark"]).toContain(themeAfter);
  });

  test("theme persists after navigating to another page", async ({ page }) => {
    await page.goto("/");

    // Toggle theme
    await page.locator("#theme-btn").click();
    const expectedTheme = await page.locator("html").getAttribute("data-theme");

    // Navigate to posts page
    await page.goto("/posts/");

    const themeOnNewPage = await page
      .locator("html")
      .getAttribute("data-theme");
    expect(themeOnNewPage).toEqual(expectedTheme);
  });
});
