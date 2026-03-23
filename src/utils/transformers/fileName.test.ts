import { describe, it, expect, vi } from "vitest";
import type { Element } from "hast";
import { transformerFileName } from "./fileName";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeNode(existingStyle?: string): Element {
  return {
    type: "element",
    tagName: "pre",
    properties: existingStyle ? { style: existingStyle } : {},
    children: [],
  };
}

function makeContext(raw?: string) {
  return {
    options: {
      meta: raw !== undefined ? { __raw: raw } : undefined,
    },
    addClassToHast: vi.fn(),
  };
}

type TransformerContext = ReturnType<typeof makeContext>;

function runPre(
  options: Parameters<typeof transformerFileName>[0],
  raw: string | undefined,
  node?: Element
): { node: Element; ctx: TransformerContext } {
  const transformer = transformerFileName(options);
  const ctx = makeContext(raw);
  const n = node ?? makeNode();
  transformer.pre.call(
    ctx as unknown as Parameters<typeof transformer.pre>[0],
    n
  );
  return { node: n, ctx };
}

function getSpan(node: Element): Element | undefined {
  return node.children.find(
    (c): c is Element =>
      c.type === "element" && (c as Element).tagName === "span"
  );
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("transformerFileName", () => {
  describe("CSS custom property", () => {
    it("sets --file-name-offset to -0.75rem for v2 (default)", () => {
      const { node } = runPre({}, undefined);
      expect(node.properties.style).toContain("--file-name-offset: -0.75rem");
    });

    it("sets --file-name-offset to 0.75rem for v1", () => {
      const { node } = runPre({ style: "v1" }, undefined);
      expect(node.properties.style).toContain("--file-name-offset: 0.75rem");
    });

    it("appends to an existing style attribute", () => {
      const node = makeNode("color: red;");
      runPre({}, undefined, node);
      expect(node.properties.style).toContain("color: red;");
      expect(node.properties.style).toContain("--file-name-offset:");
    });
  });

  describe("early returns (no span added)", () => {
    it("does not add a span when there is no meta", () => {
      const { node, ctx } = runPre({}, undefined);
      expect(getSpan(node)).toBeUndefined();
      expect(ctx.addClassToHast).not.toHaveBeenCalled();
    });

    it("does not add a span when meta contains no file= key", () => {
      const { node, ctx } = runPre({}, 'lang="typescript"');
      expect(getSpan(node)).toBeUndefined();
      expect(ctx.addClassToHast).not.toHaveBeenCalled();
    });
  });

  describe("span creation", () => {
    it("adds a span child when file= is present", () => {
      const { node } = runPre({}, 'file="src/foo.ts"');
      expect(getSpan(node)).toBeDefined();
    });

    it("sets the span text to the file name", () => {
      const { node } = runPre({}, 'file="src/foo.ts"');
      const span = getSpan(node)!;
      const text = span.children.find(c => c.type === "text");
      expect((text as { type: "text"; value: string }).value).toBe(
        "src/foo.ts"
      );
    });

    it("strips double quotes from the file value", () => {
      const { node } = runPre({}, 'file="config.ts"');
      const span = getSpan(node)!;
      const text = span.children.find(c => c.type === "text") as {
        value: string;
      };
      expect(text.value).toBe("config.ts");
    });

    it("strips single quotes from the file value", () => {
      const { node } = runPre({}, "file='config.ts'");
      const text = getSpan(node)!.children.find(c => c.type === "text") as {
        value: string;
      };
      expect(text.value).toBe("config.ts");
    });

    it("strips backticks from the file value", () => {
      const { node } = runPre({}, "file=`config.ts`");
      const text = getSpan(node)!.children.find(c => c.type === "text") as {
        value: string;
      };
      expect(text.value).toBe("config.ts");
    });

    it("parses file= correctly alongside other meta attributes", () => {
      const { node } = runPre({}, 'lang="ts" file="utils.ts" highlight="1"');
      const text = getSpan(node)!.children.find(c => c.type === "text") as {
        value: string;
      };
      expect(text.value).toBe("utils.ts");
    });

    it("calls addClassToHast when a file name is found", () => {
      const { ctx } = runPre({}, 'file="foo.ts"');
      expect(ctx.addClassToHast).toHaveBeenCalledOnce();
    });
  });

  describe("v1 vs v2 styling", () => {
    it("v1 span includes left-0 and -top-6 positioning classes", () => {
      const { node } = runPre({ style: "v1" }, 'file="foo.ts"');
      const classes = getSpan(node)!.properties.class as string[];
      expect(classes.some(c => c.includes("left-0"))).toBe(true);
      expect(classes.some(c => c.includes("-top-6"))).toBe(true);
    });

    it("v2 span includes left-2 and top-(--file-name-offset) positioning classes", () => {
      const { node } = runPre({ style: "v2" }, 'file="foo.ts"');
      const classes = getSpan(node)!.properties.class as string[];
      expect(classes.some(c => c.includes("left-2"))).toBe(true);
      expect(classes.some(c => c.includes("top-(--file-name-offset)"))).toBe(
        true
      );
    });

    it("v1 passes rounded-tl-none to addClassToHast", () => {
      const { ctx } = runPre({ style: "v1" }, 'file="foo.ts"');
      const classArg = ctx.addClassToHast.mock.calls[0][1] as string;
      expect(classArg).toContain("rounded-tl-none");
    });

    it("v2 does not pass rounded-tl-none to addClassToHast", () => {
      const { ctx } = runPre({ style: "v2" }, 'file="foo.ts"');
      const classArg = ctx.addClassToHast.mock.calls[0][1] as string;
      expect(classArg).not.toContain("rounded-tl-none");
    });
  });

  describe("hideDot option", () => {
    it("hideDot: false (default) includes dot indicator classes", () => {
      const { node } = runPre({ hideDot: false }, 'file="foo.ts"');
      const classes = getSpan(node)!.properties.class as string[];
      expect(classes.some(c => c.includes("before:bg-green-500"))).toBe(true);
    });

    it("hideDot: true uses px-2 and omits dot indicator classes", () => {
      const { node } = runPre({ hideDot: true }, 'file="foo.ts"');
      const classes = getSpan(node)!.properties.class as string[];
      expect(classes.some(c => c.includes("px-2"))).toBe(true);
      expect(classes.every(c => !c.includes("before:bg-green-500"))).toBe(true);
    });
  });
});
