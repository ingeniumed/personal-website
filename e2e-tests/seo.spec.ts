import { test, expect } from "@playwright/test";

test.describe("SEO & Meta Tags", () => {
  test("homepage has title, description, and OG tags", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/gopal krishnan/i);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute("content", /.+/);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /.+/);
  });

  test("blog post has article OG type, og:title, og:image, and published_time", async ({
    page,
  }) => {
    await page.goto("/posts/working-at-automattic/");

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "article");

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /automattic/i);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /.+/);

    const publishedTime = page.locator(
      'meta[property="article:published_time"]'
    );
    await expect(publishedTime).toHaveAttribute("content", /.+/);
  });

  test("OG image URL for post returns a real PNG", async ({
    page,
    request,
  }) => {
    await page.goto("/posts/working-at-automattic/");

    const ogImage = page.locator('meta[property="og:image"]');
    const imageUrl = await ogImage.getAttribute("content");
    expect(imageUrl).toBeTruthy();

    // Verify the OG image URL contains expected path pattern
    expect(imageUrl).toMatch(/\/posts\/working-at-automattic\//);

    // Fetch the OG image and verify it returns a valid PNG
    const response = await request.get(imageUrl!);
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toMatch(/image\/png/);
  });

  test("canonical URL is set on homepage", async ({ page }) => {
    await page.goto("/");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /.+/);
  });

  test("robots.txt exists and is valid", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/user-agent/i);
    expect(body).toMatch(/sitemap/i);
  });

  test("RSS feed returns valid XML", async ({ request }) => {
    const response = await request.get("/rss.xml");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toMatch(/xml/);
    const body = await response.text();
    expect(body).toMatch(/<rss/);
    expect(body).toMatch(/Gopal Krishnan/);
  });

  test("homepage has JSON-LD structured data", async ({ page }) => {
    await page.goto("/");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toBeAttached();
    const content = await jsonLd.first().textContent();
    expect(content).toBeTruthy();
    const parsed = JSON.parse(content!);
    expect(parsed["@type"]).toBeTruthy();
  });
});
