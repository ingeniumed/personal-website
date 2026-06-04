import type { FontData } from "astro:assets";

type FontFormat =
  | "woff"
  | "woff2"
  | "truetype"
  | "opentype"
  | "embedded-opentype"
  | "svg";

export function getFontPathByWeight(
  fonts: FontData[],
  weight: number,
  options?: {
    style?: "normal" | "italic";
    format?: FontFormat;
  }
): string | undefined {
  const style = options?.style ?? "normal";
  const format = options?.format ?? "woff";

  return fonts
    .find(font => font.weight === String(weight) && font.style === style)
    ?.src.find(file => file.format === format)?.url;
}
