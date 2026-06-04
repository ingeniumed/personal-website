import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { loadOgFonts } from "@/utils/og/loadOgFonts";
import { wrapInOgBorder } from "@/utils/og/ogTemplate";
import { getPath } from "@/utils/getPath";
import { SITE } from "@/config";

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPath(post.id, post.filePath, false) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props, url }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const fonts = await loadOgFonts(url);
  const post = props as CollectionEntry<"blog">;

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
          type: "p",
          props: {
            style: {
              fontSize: 72,
              fontWeight: "bold",
              maxHeight: "84%",
              overflow: "hidden",
            },
            children: post.data.title,
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "100%",
              marginBottom: "8px",
              fontSize: 28,
            },
            children: [
              "by ",
              {
                type: "span",
                props: {
                  style: { color: "transparent" },
                  children: '"',
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontWeight: "bold",
                  },
                  children: post.data.author,
                },
              },
            ],
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
