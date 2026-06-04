import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import type { Font } from "satori";

const FONT_NAME = "IBM Plex Mono";
const FONT_CSS_VAR = "--font-ibm-plex-mono";

/**
 * Loads font data for OG image generation.
 * Uses Astro's experimental_getFontFileURL API to resolve font paths at build time.
 * This API is experimental in Astro 6 but provides better performance than manual font loading.
 *
 * @param url - The request URL (needed for experimental_getFontFileURL to resolve relative paths)
 * @returns Array of font configs for Satori
 */
export async function loadOgFonts(url: URL): Promise<Font[]> {
  const fonts = fontData[FONT_CSS_VAR];

  if (!fonts) {
    throw new Error(
      `Font data not found for CSS variable "${FONT_CSS_VAR}". ` +
        `Ensure the font is configured in astro.config.ts with woff format.`
    );
  }

  const regularFontPath = getFontPathByWeight(fonts, 400);
  const boldFontPath = getFontPathByWeight(fonts, 700);

  if (!regularFontPath) {
    throw new Error(
      `Cannot find regular font (weight 400, woff format) for "${FONT_NAME}". ` +
        `Check that astro.config.ts includes weight 400 with woff format.`
    );
  }

  if (!boldFontPath) {
    throw new Error(
      `Cannot find bold font (weight 700, woff format) for "${FONT_NAME}". ` +
        `Check that astro.config.ts includes weight 700 with woff format.`
    );
  }

  const [regularData, boldData] = await Promise.all([
    fetch(experimental_getFontFileURL(regularFontPath, url)).then(res =>
      res.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(boldFontPath, url)).then(res =>
      res.arrayBuffer()
    ),
  ]);

  return [
    {
      name: FONT_NAME,
      data: regularData,
      weight: 400,
      style: "normal",
    },
    {
      name: FONT_NAME,
      data: boldData,
      weight: 700,
      style: "normal",
    },
  ];
}
