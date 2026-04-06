import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about/");
  });

  test("loads with About heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /about/i }).first()
    ).toBeVisible();
  });

  test("shows a profile image", async ({ page }) => {
    await expect(page.locator("img").first()).toBeVisible();
  });

  test("bio mentions Automattic", async ({ page }) => {
    await expect(page.locator("body")).toContainText("Automattic");
  });

  test("has breadcrumb navigation", async ({ page }) => {
    await expect(
      page.locator("nav[aria-label*='breadcrumb'], .breadcrumb, ol").first()
    ).toBeVisible();
  });
});
