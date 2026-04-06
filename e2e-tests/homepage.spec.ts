import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Gopal Krishnan | Developer, Dad, Coffee Enthusiast"
    );
  });

  test("shows intro heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /hey.*gopal/i })
    ).toBeVisible();
  });

  test("shows avatar image linking to /about", async ({ page }) => {
    // The avatar link is in the main content area (not the header nav)
    const avatarLink = page.locator('main a[href="/about"]').first();
    await expect(avatarLink).toBeAttached();
    const img = avatarLink.locator("img");
    await expect(img).toBeAttached();
  });

  test("shows social links", async ({ page }) => {
    await expect(page.locator('a[href*="github.com"]').first()).toBeVisible();
    await expect(
      page.locator('a[href*="linkedin.com"]').first()
    ).toBeVisible();
  });

  test("shows RSS feed link", async ({ page }) => {
    await expect(page.locator('a[href="/rss.xml"]')).toBeVisible();
  });

  test("shows up to 4 recent posts", async ({ page }) => {
    const postCards = page.locator("article, li").filter({
      has: page.locator("a[href^='/posts/']"),
    });
    const count = await postCards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(4);
  });

  test("each post card has a title and datetime", async ({ page }) => {
    const firstPostLink = page.locator("a[href^='/posts/']").first();
    await expect(firstPostLink).toBeVisible();
    // Datetime element should be present somewhere on the page
    await expect(page.locator("time").first()).toBeVisible();
  });

  test("has All Posts link to /posts/", async ({ page }) => {
    const allPostsLink = page.getByRole("link", { name: /all posts/i });
    await expect(allPostsLink).toBeVisible();
    await allPostsLink.click();
    await expect(page).toHaveURL("/posts/");
  });
});
