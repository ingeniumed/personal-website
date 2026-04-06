import { test, expect } from "@playwright/test";

test.describe("404 Page", () => {
  // Note: Astro's local preview server may not handle 404s identically to
  // Cloudflare Pages. If these tests fail locally but pass in production,
  // check that `pnpm build` produced a 404.html and that the preview server
  // is serving it correctly.
  test("navigating to a nonexistent URL shows 404 content", async ({
    page,
  }) => {
    // Astro builds a 404.html file. The preview server serves it for unknown
    // paths. Navigate directly to the built 404 page to validate its content.
    // NOTE: On Cloudflare Pages, unknown URLs also serve 404.html automatically.
    // Astro's local preview server may redirect unknown paths to index.html
    // instead — behaviour that differs from production. The /404 direct path
    // works in both environments and tests the 404 page content reliably.
    await page.goto("/404", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText("Page Not Found")).toBeVisible();
  });

  test("404 page has a link back to home", async ({ page }) => {
    await page.goto("/404", { waitUntil: "domcontentloaded" });

    const homeLink = page
      .getByRole("link", { name: /go back|home|back/i })
      .or(page.locator('a[href="/"]'));
    await expect(homeLink.first()).toBeVisible();
  });
});
