import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import getSortedPosts from "./getSortedPosts";
import type { CollectionEntry } from "astro:content";

function makePost(options: {
  id?: string;
  draft?: boolean;
  pubDatetime: Date;
  modDatetime?: Date | null;
}): CollectionEntry<"blog"> {
  return {
    id: options.id ?? "test-post",
    data: {
      draft: options.draft ?? false,
      pubDatetime: options.pubDatetime,
      modDatetime: options.modDatetime ?? null,
      author: "Test Author",
      title: "Test Post",
      description: "Test description",
    },
  } as unknown as CollectionEntry<"blog">;
}

describe("getSortedPosts", () => {
  beforeAll(() => {
    vi.stubEnv("DEV", false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns an empty array for empty input", () => {
    expect(getSortedPosts([])).toEqual([]);
  });

  it("filters out draft posts", () => {
    const published = makePost({
      id: "published",
      pubDatetime: new Date("2024-01-01"),
    });
    const draft = makePost({
      id: "draft",
      draft: true,
      pubDatetime: new Date("2024-01-02"),
    });

    const result = getSortedPosts([published, draft]);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("published");
  });

  it("filters out future posts beyond the scheduled margin", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-01T12:00:00Z"));

    const past = makePost({ id: "past", pubDatetime: new Date("2025-01-01") });
    const future = makePost({
      id: "future",
      pubDatetime: new Date("2025-06-01T14:00:00Z"),
    }); // 2 hours away

    const result = getSortedPosts([past, future]);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("past");
  });

  it("sorts posts by pubDatetime in descending order (newest first)", () => {
    const older = makePost({
      id: "older",
      pubDatetime: new Date("2024-01-01"),
    });
    const newer = makePost({
      id: "newer",
      pubDatetime: new Date("2024-06-01"),
    });
    const middle = makePost({
      id: "middle",
      pubDatetime: new Date("2024-03-01"),
    });

    const result = getSortedPosts([older, newer, middle]);

    expect(result.map(p => p.id)).toEqual(["newer", "middle", "older"]);
  });

  it("returns all non-draft past posts sorted descending by date", () => {
    const posts = [
      makePost({ id: "jan", pubDatetime: new Date("2023-01-01") }),
      makePost({ id: "dec", pubDatetime: new Date("2023-12-01") }),
      makePost({ id: "jun", pubDatetime: new Date("2023-06-01") }),
    ];

    const result = getSortedPosts(posts);

    expect(result).toHaveLength(3);
    expect(result.map(p => p.id)).toEqual(["dec", "jun", "jan"]);
  });

  it("uses modDatetime over pubDatetime when sorting", () => {
    const postA = makePost({
      id: "post-a",
      pubDatetime: new Date("2024-01-01"),
      modDatetime: new Date("2024-12-01"), // recently modified
    });
    const postB = makePost({
      id: "post-b",
      pubDatetime: new Date("2024-06-01"), // published later than postA but not modified
    });

    // postA's effective date (Dec) > postB's effective date (Jun) → postA first
    const result = getSortedPosts([postA, postB]);

    expect(result[0].id).toBe("post-a");
    expect(result[1].id).toBe("post-b");
  });

  it("treats null modDatetime as absent (falls back to pubDatetime for sorting)", () => {
    const postA = makePost({
      id: "post-a",
      pubDatetime: new Date("2024-03-01"),
      modDatetime: null,
    });
    const postB = makePost({
      id: "post-b",
      pubDatetime: new Date("2024-06-01"),
    });

    const result = getSortedPosts([postA, postB]);

    expect(result[0].id).toBe("post-b");
    expect(result[1].id).toBe("post-a");
  });

  it("preserves original order for posts with the same effective date", () => {
    // The sort rounds to whole seconds, so posts within the same second are
    // considered equal. JavaScript's Array.sort is stable, so the original
    // order should be preserved for equal elements.
    const sameDate = new Date("2024-06-01T12:00:00Z");
    const postA = makePost({ id: "post-a", pubDatetime: sameDate });
    const postB = makePost({ id: "post-b", pubDatetime: sameDate });

    const result = getSortedPosts([postA, postB]);

    expect(result.map(p => p.id)).toEqual(["post-a", "post-b"]);
  });
});
