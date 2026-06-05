import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { loadOgFonts } from "@/utils/og/loadOgFonts";
import { wrapInOgBorder } from "@/utils/og/ogTemplate";
import config from "@/config";

export const GET: APIRoute = async ({ url }) => {
  const fonts = await loadOgFonts(url);

  const content = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "20px",
        width: "90%",
        height: "90%",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "90%",
              maxHeight: "90%",
              overflow: "hidden",
              textAlign: "center",
            },
            children: [
              {
                type: "p",
                props: {
                  style: { fontSize: 72, fontWeight: "bold" },
                  children: config.site.title,
                },
              },
              {
                type: "p",
                props: {
                  style: { fontSize: 28 },
                  children: config.site.description,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              marginBottom: "8px",
              fontSize: 28,
            },
            children: {
              type: "span",
              props: {
                style: { overflow: "hidden", fontWeight: "bold" },
                children: new URL(config.site.url).hostname,
              },
            },
          },
        },
      ],
    },
  };

  const svg = await satori(wrapInOgBorder(content), {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts,
  });

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
