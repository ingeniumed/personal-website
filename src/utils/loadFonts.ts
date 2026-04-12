import { readFile } from "fs/promises";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function resolveFont(filename: string): string {
  return require.resolve(
    `@ibm/plex/IBM-Plex-Mono/fonts/complete/woff/${filename}`
  );
}

async function loadFontFile(path: string): Promise<ArrayBuffer> {
  const buf = await readFile(path);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

async function loadFonts() {
  const fontsConfig = [
    {
      name: "IBM Plex Mono",
      path: resolveFont("IBMPlexMono-Regular.woff"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "IBM Plex Mono",
      path: resolveFont("IBMPlexMono-Bold.woff"),
      weight: 700 as const,
      style: "normal" as const,
    },
  ];

  return Promise.all(
    fontsConfig.map(async ({ name, path, weight, style }) => {
      const data = await loadFontFile(path);
      return { name, data, weight, style };
    })
  );
}

export default loadFonts;
