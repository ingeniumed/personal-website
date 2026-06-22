import { defineConfig, fontProviders, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import rehypeCallouts from "rehype-callouts";
import mdx from "@astrojs/mdx";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page => config.posts?.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "IBM Plex Mono",
      cssVariable: "--font-ibm-plex-mono",
      fallbacks: ["monospace"],
      formats: ["woff", "woff2"],
      options: {
        variants: [
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-Light.woff2",
            ],
            weight: "300",
            style: "normal",
          },
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-Regular.woff2",
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff/IBMPlexMono-Regular.woff",
            ],
            weight: "400",
            style: "normal",
          },
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-Medium.woff2",
            ],
            weight: "500",
            style: "normal",
          },
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-SemiBold.woff2",
            ],
            weight: "600",
            style: "normal",
          },
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-Bold.woff2",
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff/IBMPlexMono-Bold.woff",
            ],
            weight: "700",
            style: "normal",
          },
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-LightItalic.woff2",
            ],
            weight: "300",
            style: "italic",
          },
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-Italic.woff2",
            ],
            weight: "400",
            style: "italic",
          },
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-MediumItalic.woff2",
            ],
            weight: "500",
            style: "italic",
          },
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-SemiBoldItalic.woff2",
            ],
            weight: "600",
            style: "italic",
          },
          {
            src: [
              "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-BoldItalic.woff2",
            ],
            weight: "700",
            style: "italic",
          },
        ],
      },
    },
  ],
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
