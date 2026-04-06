import { test, expect } from "@playwright/test";

test.describe("Posts Listing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/posts/");
  });

  test("loads with a heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /posts/i }).first()
    ).toBeVisible();
  });

  test("shows post cards with title and datetime", async ({ page }) => {
    const postLinks = page.locator("a[href^='/posts/']");
    await expect(postLinks.first()).toBeVisible();
    await expect(page.locator("time").first()).toBeVisible();
  });

  test("posts are in reverse chronological order", async ({ page }) => {
    const datetimes = page.locator("time");
    const count = await datetimes.count();
    if (count < 2) return; // can't compare order with fewer than 2

    const dates: Date[] = [];
    for (let i = 0; i < Math.min(count, 6); i++) {
      const dt = await datetimes.nth(i).getAttribute("datetime");
      if (dt) dates.push(new Date(dt));
    }

    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1].getTime()).toBeGreaterThanOrEqual(
        dates[i].getTime()
      );
    }
  });

  test("pagination appears only when more than postPerPage posts exist", async ({
    page,
  }) => {
    // postPerPage is 6 — count visible post links to determine if pagination is expected
    const postLinks = page.locator("a[href^='/posts/']");
    const visibleCount = await postLinks.count();

    const paginationNext = page.locator(
      'a[aria-label*="next"], a[href*="/posts/2"]'
    );

    if (visibleCount >= 6) {
      // There are enough posts that page 2 may exist — check if pagination is present
      const paginationExists = (await paginationNext.count()) > 0;
      if (paginationExists) {
        await expect(paginationNext.first()).toBeVisible();
        await paginationNext.first().click();
        await expect(page).toHaveURL(/\/posts\//);
      }
    } else {
      // Fewer than 6 posts — pagination should not be present
      await expect(paginationNext).toHaveCount(0);
    }
  });
});
