import { describe, it, expect } from "vitest";
import loadFonts from "./loadFonts";

describe("loadFonts", () => {
  it("returns two font objects (one per weight)", async () => {
    const fonts = await loadFonts();
    expect(fonts).toHaveLength(2);
  });

  it("returns fonts for weight 400 and 700", async () => {
    const fonts = await loadFonts();
    expect(fonts.map(f => f.weight)).toEqual([400, 700]);
  });

  it("each font has the correct name, style, and data shape", async () => {
    const fonts = await loadFonts();
    for (const font of fonts) {
      expect(font.name).toBe("IBM Plex Mono");
      expect(font.style).toBe("normal");
      expect(font.data).toBeInstanceOf(ArrayBuffer);
    }
  });

  it("font data is non-empty", async () => {
    const fonts = await loadFonts();
    for (const font of fonts) {
      expect((font.data as ArrayBuffer).byteLength).toBeGreaterThan(0);
    }
  });
});
