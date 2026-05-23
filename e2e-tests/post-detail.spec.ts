import { test, expect } from "@playwright/test";

test.describe("Post Detail Page", () => {
  test("renders a post navigated to from the listing page", async ({
    page,
  }) => {
    await page.goto("/posts/");
    // Get the first post link dynamically — don't hardcode a slug
    const firstPostLink = page.locator("a[href^='/posts/']").first();
    const href = await firstPostLink.getAttribute("href");
    await firstPostLink.click();

    // h1 should match the post title
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // URL should be the post we clicked
    await expect(page).toHaveURL(href!);
  });

  test("post detail shows publish date", async ({ page }) => {
    await page.goto("/posts/");
    const firstPostLink = page.locator("a[href^='/posts/']").first();
    await firstPostLink.click();
    await expect(page.locator("time").first()).toBeVisible();
  });

  test("post detail shows share links section", async ({ page }) => {
    await page.goto("/posts/");
    const firstPostLink = page.locator("a[href^='/posts/']").first();
    await firstPostLink.click();
    // ShareLinks component renders "Share this post on:" text
    await expect(page.getByText("Share this post on:")).toBeVisible();
  });

  test("post detail has heading anchor links in DOM", async ({ page }) => {
    // Navigate to a post known to have h2+ headings
    await page.goto("/posts/working-at-automattic/");
    // Heading links are appended dynamically by PostDetails.astro — wait for JS
    await expect(page.locator(".heading-link").first()).toBeAttached({
      timeout: 10000,
    });
  });
});

test.describe("Working at Automattic — Table of Contents", () => {
  test.beforeEach(async ({ page }) => {
    // TOC is desktop-only (`hidden xl:block`).
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/posts/working-at-automattic/");
  });

  test("page loads with correct h1", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: /automattic/i })
    ).toBeVisible();
  });

  test("table of contents nav is visible on desktop", async ({ page }) => {
    const tocNav = page.getByRole("navigation", { name: "On this page" });
    await expect(tocNav).toBeVisible();
    await expect(tocNav.locator("a").first()).toBeVisible();
  });

  test("clicking a TOC link jumps to the correct heading", async ({
    page,
  }) => {
    // Find TOC link inside the desktop On this page navigation.
    const positionLink = page.getByRole("navigation", { name: "On this page" }).getByRole("link", {
      name: "The Position",
    });
    await expect(positionLink).toBeVisible();
    await positionLink.click();

    // URL hash should update
    await expect(page).toHaveURL(
      /\/posts\/working-at-automattic\/#the-position/
    );

    // The target heading should be in the viewport
    await expect(page.locator("#the-position")).toBeInViewport();
  });

  test("clicking second TOC link also jumps correctly", async ({ page }) => {
    const breakdownLink = page.getByRole("navigation", { name: "On this page" }).getByRole("link", {
      name: "Breakdown of the Interview Process",
    });
    await expect(breakdownLink).toBeVisible();
    await breakdownLink.click();

    await expect(page).toHaveURL(
      /\/posts\/working-at-automattic\/#breakdown-of-the-interview-process/
    );
    await expect(
      page.locator("#breakdown-of-the-interview-process")
    ).toBeInViewport();
  });
});
