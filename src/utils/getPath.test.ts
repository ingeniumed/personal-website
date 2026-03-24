import { describe, it, expect, vi } from "vitest";

vi.mock("@/content.config", () => ({
  BLOG_PATH: "src/data/blog",
}));

// Import after mock is declared so the mock is in place
const { getPath } = await import("./getPath");

describe("getPath", () => {
  describe("top-level posts (no subdirectory)", () => {
    it("returns /posts/<slug> for a post at the blog root", () => {
      expect(getPath("my-post", "src/data/blog/my-post.md")).toBe(
        "/posts/my-post"
      );
    });

    it("omits the base path when includeBase is false", () => {
      expect(getPath("my-post", "src/data/blog/my-post.md", false)).toBe(
        "/my-post"
      );
    });

    it("falls back to /posts/<id> when filePath is undefined", () => {
      expect(getPath("my-post", undefined)).toBe("/posts/my-post");
    });
  });

  describe("posts in subdirectories", () => {
    it("includes the subdirectory in the path", () => {
      expect(getPath("subdir/my-post", "src/data/blog/subdir/my-post.md")).toBe(
        "/posts/subdir/my-post"
      );
    });

    it("omits the base path with a subdirectory when includeBase is false", () => {
      expect(
        getPath("subdir/my-post", "src/data/blog/subdir/my-post.md", false)
      ).toBe("/subdir/my-post");
    });

    it("handles nested subdirectories", () => {
      expect(
        getPath(
          "a/b/my-post",
          "src/data/blog/category-a/sub-category-b/my-post.md"
        )
      ).toBe("/posts/category-a/sub-category-b/my-post");
    });

    it("slugifies directory names with uppercase letters", () => {
      expect(getPath("my-post", "src/data/blog/My Category/my-post.md")).toBe(
        "/posts/my-category/my-post"
      );
    });

    it("slugifies directory names with spaces", () => {
      expect(getPath("my-post", "src/data/blog/cool posts/my-post.md")).toBe(
        "/posts/cool-posts/my-post"
      );
    });

    it("uses only the last segment of the id as the slug", () => {
      // Astro glob loader IDs for nested posts include the subdirectory prefix,
      // but only the final segment should appear as the slug in the URL.
      expect(
        getPath(
          "subdir/deeply-nested-post",
          "src/data/blog/subdir/deeply-nested-post.md"
        )
      ).toBe("/posts/subdir/deeply-nested-post");
    });
  });

  describe("underscore-prefixed directories", () => {
    it("excludes directories starting with underscore", () => {
      expect(getPath("my-post", "src/data/blog/_drafts/my-post.md")).toBe(
        "/posts/my-post"
      );
    });

    it("excludes underscore directories in a deeper path", () => {
      expect(
        getPath("my-post", "src/data/blog/published/_wip/my-post.md")
      ).toBe("/posts/published/my-post");
    });
  });
});
