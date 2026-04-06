import { test, expect } from "@playwright/test";

test.describe("Navigation & Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("header shows site title linking to /", async ({ page }) => {
    const siteTitle = page.locator("header").getByRole("link", {
      name: /gopal krishnan/i,
    });
    await expect(siteTitle).toBeVisible();
    await expect(siteTitle).toHaveAttribute("href", "/");
  });

  test("header has Posts nav link", async ({ page }) => {
    const postsLink = page.locator("header").getByRole("link", {
      name: /posts/i,
    });
    await expect(postsLink).toBeVisible();
  });

  test("header has About nav link", async ({ page }) => {
    const aboutLink = page.locator("header").getByRole("link", {
      name: /about/i,
    });
    await expect(aboutLink).toBeVisible();
  });

  test("header has theme toggle button", async ({ page }) => {
    await expect(page.locator("#theme-btn")).toBeVisible();
  });

  test("has skip to content link", async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test("footer shows copyright with author name", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toContainText("Gopal Krishnan");
  });

  test("navigating to Posts page works", async ({ page }) => {
    // Use href-based selector — the nav link is href="/posts" (no trailing slash)
    await page.locator('header a[href="/posts"]').click();
    await page.waitForURL(/\/posts/);
    await expect(page.url()).toMatch(/\/posts/);
  });

  test("navigating to About page works", async ({ page }) => {
    await page.locator('header a[href="/about"]').click();
    await page.waitForURL(/\/about/);
    await expect(page.url()).toMatch(/\/about/);
  });
});
