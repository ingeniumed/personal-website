import { describe, it, expect } from "vitest";
import { getFontPathByWeight } from "./getFontPathByWeight";
import type { FontData } from "astro:assets";

describe("getFontPathByWeight", () => {
  const mockFonts: FontData[] = [
    {
      weight: "400",
      style: "normal",
      src: [
        { url: "/fonts/regular.woff2", format: "woff2" },
        { url: "/fonts/regular.woff", format: "woff" },
      ],
    },
    {
      weight: "400",
      style: "italic",
      src: [
        { url: "/fonts/regular-italic.woff2", format: "woff2" },
        { url: "/fonts/regular-italic.woff", format: "woff" },
      ],
    },
    {
      weight: "700",
      style: "normal",
      src: [
        { url: "/fonts/bold.woff2", format: "woff2" },
        { url: "/fonts/bold.woff", format: "woff" },
      ],
    },
  ];

  describe("with default options", () => {
    it("should return woff format URL for weight 400 normal style", () => {
      const result = getFontPathByWeight(mockFonts, 400);
      expect(result).toBe("/fonts/regular.woff");
    });

    it("should return woff format URL for weight 700 normal style", () => {
      const result = getFontPathByWeight(mockFonts, 700);
      expect(result).toBe("/fonts/bold.woff");
    });
  });

  describe("with explicit style option", () => {
    it("should return italic style when specified", () => {
      const result = getFontPathByWeight(mockFonts, 400, { style: "italic" });
      expect(result).toBe("/fonts/regular-italic.woff");
    });

    it("should return normal style when explicitly specified", () => {
      const result = getFontPathByWeight(mockFonts, 400, { style: "normal" });
      expect(result).toBe("/fonts/regular.woff");
    });
  });

  describe("with explicit format option", () => {
    it("should return woff2 format when specified", () => {
      const result = getFontPathByWeight(mockFonts, 400, { format: "woff2" });
      expect(result).toBe("/fonts/regular.woff2");
    });

    it("should return woff format when explicitly specified", () => {
      const result = getFontPathByWeight(mockFonts, 400, { format: "woff" });
      expect(result).toBe("/fonts/regular.woff");
    });
  });

  describe("with combined options", () => {
    it("should respect both style and format options", () => {
      const result = getFontPathByWeight(mockFonts, 400, {
        style: "italic",
        format: "woff2",
      });
      expect(result).toBe("/fonts/regular-italic.woff2");
    });
  });

  describe("edge cases", () => {
    it("should return undefined for non-existent weight", () => {
      const result = getFontPathByWeight(mockFonts, 500);
      expect(result).toBeUndefined();
    });

    it("should return undefined for non-existent style", () => {
      const result = getFontPathByWeight(mockFonts, 700, { style: "italic" });
      expect(result).toBeUndefined();
    });

    it("should return undefined for non-existent format", () => {
      const result = getFontPathByWeight(mockFonts, 400, { format: "ttf" });
      expect(result).toBeUndefined();
    });

    it("should handle empty fonts array", () => {
      const result = getFontPathByWeight([], 400);
      expect(result).toBeUndefined();
    });

    it("should handle font entry with empty src array", () => {
      const fontsWithEmptySrc: FontData[] = [
        {
          weight: "400",
          style: "normal",
          src: [],
        },
      ];
      const result = getFontPathByWeight(fontsWithEmptySrc, 400);
      expect(result).toBeUndefined();
    });
  });
});
