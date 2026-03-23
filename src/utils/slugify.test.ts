import { describe, it, expect } from "vitest";
import { slugifyStr } from "./slugify";

describe("slugifyStr", () => {
  it("converts a simple string to a slug", () => {
    expect(slugifyStr("hello world")).toBe("hello-world");
  });

  it("lowercases uppercase characters", () => {
    expect(slugifyStr("Hello World")).toBe("hello-world");
  });

  it("handles already-slugified strings", () => {
    expect(slugifyStr("hello-world")).toBe("hello-world");
  });

  it("collapses multiple spaces", () => {
    expect(slugifyStr("hello   world")).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(slugifyStr("hello & world!")).toBe("hello-world");
  });

  it("handles numbers", () => {
    expect(slugifyStr("post 2025")).toBe("post-2025");
  });

  it("handles mixed case with numbers", () => {
    expect(slugifyStr("My Post 2025")).toBe("my-post-2025");
  });

  it("returns an empty string for empty input", () => {
    expect(slugifyStr("")).toBe("");
  });

  it("normalises accented / unicode characters", () => {
    expect(slugifyStr("café")).toBe("cafe");
  });

  it("trims leading and trailing whitespace", () => {
    expect(slugifyStr("  hello  ")).toBe("hello");
  });
});
