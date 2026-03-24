import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import postFilter from "./postFilter";
import { SITE } from "@/config";
import type { CollectionEntry } from "astro:content";

const MARGIN_MS = SITE.scheduledPostMargin;

function makePost(options: {
  draft?: boolean;
  pubDatetime: Date;
}): CollectionEntry<"blog"> {
  return {
    data: {
      draft: options.draft ?? false,
      pubDatetime: options.pubDatetime,
      author: "Test Author",
      title: "Test Post",
      description: "Test description",
    },
  } as unknown as CollectionEntry<"blog">;
}

describe("postFilter", () => {
  beforeAll(() => {
    vi.stubEnv("DEV", false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("filters out draft posts", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-01T12:00:00Z"));

    const post = makePost({ draft: true, pubDatetime: new Date("2024-01-01") });
    expect(postFilter(post)).toBe(false);
  });

  it("filters out a draft post even when pubDatetime is in the future", () => {
    // draft flag takes precedence — scheduling is irrelevant
    vi.useFakeTimers();
    const now = new Date("2025-06-01T12:00:00Z");
    vi.setSystemTime(now);

    const future = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow
    const post = makePost({ draft: true, pubDatetime: future });
    expect(postFilter(post)).toBe(false);
  });

  it("passes a published post with a past date", () => {
    vi.useFakeTimers();
    const now = new Date("2025-06-01T12:00:00Z");
    vi.setSystemTime(now);

    const past = new Date(now.getTime() - 60_000); // 1 minute ago
    const post = makePost({ pubDatetime: past });
    expect(postFilter(post)).toBe(true);
  });

  it("passes a post published at exactly now", () => {
    vi.useFakeTimers();
    const now = new Date("2025-06-01T12:00:00Z");
    vi.setSystemTime(now);

    const post = makePost({ pubDatetime: now });
    // Date.now() > now - MARGIN_MS => now > now - 15min => true
    expect(postFilter(post)).toBe(true);
  });

  it("passes a future post that falls within the 15-minute scheduled margin", () => {
    vi.useFakeTimers();
    const now = new Date("2025-06-01T12:00:00Z");
    vi.setSystemTime(now);

    // pubDatetime is 10 minutes in the future — within the 15-minute window
    const nearFuture = new Date(now.getTime() + 10 * 60 * 1000);
    const post = makePost({ pubDatetime: nearFuture });
    expect(postFilter(post)).toBe(true);
  });

  it("filters out a future post that is beyond the 15-minute margin", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-01T12:00:00Z"));

    const farFuture = new Date("2025-06-01T12:30:00Z"); // 30 min away
    const post = makePost({ pubDatetime: farFuture });
    expect(postFilter(post)).toBe(false);
  });

  it("filters out a future post at the exact margin boundary", () => {
    vi.useFakeTimers();
    const now = new Date("2025-06-01T12:00:00Z");
    vi.setSystemTime(now);

    // pubDatetime is exactly MARGIN_MS in the future
    // Date.now() > pubDatetime - MARGIN_MS => now > now => false (strict greater-than)
    const atBoundary = new Date(now.getTime() + MARGIN_MS);
    const post = makePost({ pubDatetime: atBoundary });
    expect(postFilter(post)).toBe(false);
  });
});
