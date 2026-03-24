import { describe, it, expect, vi, afterEach } from "vitest";
import loadGoogleFonts from "./loadGoogleFont";

const MOCK_FONT_URL = "https://fonts.gstatic.com/s/ibmplexmono/v1/font.ttf";

const MOCK_CSS = `@font-face {
  font-family: 'IBM Plex Mono';
  src: url(${MOCK_FONT_URL}) format('truetype');
}`;

const MOCK_FONT_BUFFER = new ArrayBuffer(8);

function makeMockFetch(css = MOCK_CSS, fontOk = true) {
  return vi.fn((url: string) => {
    if (url.includes("fonts.googleapis.com")) {
      return Promise.resolve({ text: () => Promise.resolve(css) });
    }
    return Promise.resolve({
      ok: fontOk,
      status: fontOk ? 200 : 404,
      arrayBuffer: () => Promise.resolve(MOCK_FONT_BUFFER),
    });
  });
}

describe("loadGoogleFonts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns two font objects (one per weight)", async () => {
    vi.stubGlobal("fetch", makeMockFetch());
    const fonts = await loadGoogleFonts("Hello");
    expect(fonts).toHaveLength(2);
  });

  it("returns fonts for weight 400 and 700", async () => {
    vi.stubGlobal("fetch", makeMockFetch());
    const fonts = await loadGoogleFonts("Hello");
    expect(fonts.map(f => f.weight)).toEqual([400, 700]);
  });

  it("each font has the correct name, style, and data shape", async () => {
    vi.stubGlobal("fetch", makeMockFetch());
    const fonts = await loadGoogleFonts("Hello");
    for (const font of fonts) {
      expect(font.name).toBe("IBM Plex Mono");
      expect(font.style).toBe("normal");
      expect(font.data).toBeInstanceOf(ArrayBuffer);
    }
  });

  it("calls the Google Fonts API once per weight", async () => {
    const fetchMock = makeMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    await loadGoogleFonts("Hello");
    const apiCalls = fetchMock.mock.calls
      .map(([url]) => url as string)
      .filter(url => url.includes("fonts.googleapis.com"));
    expect(apiCalls).toHaveLength(2);
    expect(apiCalls.some(url => url.includes("wght@400"))).toBe(true);
    expect(apiCalls.some(url => url.includes("wght@700"))).toBe(true);
  });

  it("URL-encodes the text parameter", async () => {
    const fetchMock = makeMockFetch();
    vi.stubGlobal("fetch", fetchMock);
    await loadGoogleFonts("Hello World");
    const apiCalls = fetchMock.mock.calls
      .map(([url]) => url as string)
      .filter(url => url.includes("fonts.googleapis.com"));
    expect(apiCalls[0]).toContain("text=Hello%20World");
  });

  it("matches opentype format as well as truetype", async () => {
    const opentypeCss = `src: url(${MOCK_FONT_URL}) format('opentype');`;
    vi.stubGlobal("fetch", makeMockFetch(opentypeCss));
    const fonts = await loadGoogleFonts("Hello");
    expect(fonts).toHaveLength(2);
  });

  it("throws when the CSS response contains no font URL", async () => {
    vi.stubGlobal("fetch", makeMockFetch("/* no src here */"));
    await expect(loadGoogleFonts("Hello")).rejects.toThrow(
      "Failed to download dynamic font"
    );
  });

  it("throws when the font binary download returns a non-ok response", async () => {
    vi.stubGlobal("fetch", makeMockFetch(MOCK_CSS, false));
    await expect(loadGoogleFonts("Hello")).rejects.toThrow(
      "Failed to download dynamic font"
    );
  });
});
