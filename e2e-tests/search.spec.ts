import { test, expect } from "@playwright/test";

test.describe("Search Page", () => {
  test("loads with Search heading and input", async ({ page }) => {
    await page.goto("/search/");
    await expect(
      page.getByRole("heading", { name: /search/i }).first()
    ).toBeVisible();
    // Pagefind UI renders its input after JS initialisation
    await expect(
      page.locator(".pagefind-ui__search-input")
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Search → Post → TOC navigation (full user journey)", () => {
  test("search for working-at-automattic, open result, jump via TOC", async ({
    page,
  }) => {
    await page.goto("/search/");

    // Wait for Pagefind to initialise
    const searchInput = page.locator(".pagefind-ui__search-input");
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    // Type search query
    await searchInput.fill("working at automattic");

    // Wait for results — Pagefind debounces by ~300ms
    const resultLink = page
      .locator(".pagefind-ui__result-title a")
      .filter({ hasText: /automattic/i })
      .first();

    await expect(resultLink).toBeVisible({ timeout: 10000 });

    // Click the result to navigate to the post
    await resultLink.click();
    await expect(page).toHaveURL(/\/posts\/working-at-automattic/);

    // Verify we landed on the post
    await expect(
      page.getByRole("heading", { level: 1, name: /automattic/i })
    ).toBeVisible();

    // The TOC is inside a <details> element — open it first
    await page.locator("details summary").first().click();
    // Click the "The Position" TOC link inside the details element
    const tocLink = page.locator("details").getByRole("link", {
      name: "The Position",
    });
    await expect(tocLink).toBeVisible();
    await tocLink.click();

    // Hash should update and heading should be in viewport
    await expect(page).toHaveURL(
      /\/posts\/working-at-automattic\/#the-position/
    );
    await expect(page.locator("#the-position")).toBeInViewport();
  });
});
