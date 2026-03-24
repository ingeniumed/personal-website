import { describe, it, expect } from "vitest";
import { remarkTocCollapse } from "./remarkTocCollapse";
import type { Heading, List, ListItem, Paragraph, Root, Text } from "mdast";

// ─── Helpers ────────────────────────────────────────────────────────────────

function heading(depth: 1 | 2 | 3 | 4 | 5 | 6, text: string): Heading {
  return {
    type: "heading",
    depth,
    children: [{ type: "text", value: text } as Text],
  };
}

function root(...children: Root["children"]): Root {
  return { type: "root", children };
}

function transform(tree: Root): Root {
  remarkTocCollapse()(tree);
  return tree;
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("remarkTocCollapse", () => {
  describe("trigger detection", () => {
    it("does not modify a tree with no TOC heading", () => {
      const tree = root(heading(2, "Introduction"), heading(2, "Conclusion"));
      const snapshot = JSON.stringify(tree);
      transform(tree);
      expect(JSON.stringify(tree)).toBe(snapshot);
    });

    it("triggers on 'Table of Contents'", () => {
      const tree = root(heading(2, "Table of Contents"), heading(2, "Intro"));
      transform(tree);
      expect(tree.children.some(n => n.type === "html")).toBe(true);
    });

    it("triggers on 'Table-of-Contents' (hyphenated)", () => {
      const tree = root(heading(2, "Table-of-Contents"), heading(2, "Intro"));
      transform(tree);
      expect(tree.children.some(n => n.type === "html")).toBe(true);
    });

    it("triggers on 'contents' (case-insensitive)", () => {
      const tree = root(heading(2, "contents"), heading(2, "Intro"));
      transform(tree);
      expect(tree.children.some(n => n.type === "html")).toBe(true);
    });

    it("triggers on 'Content' (singular)", () => {
      const tree = root(heading(2, "Content"), heading(2, "Intro"));
      transform(tree);
      expect(tree.children.some(n => n.type === "html")).toBe(true);
    });

    it("triggers when the TOC heading contains inline formatting", () => {
      // e.g. "## Table of **Contents**" — toString() extracts the plain text
      // so the regex still matches even with bold/code children
      const richTocHeading: Heading = {
        type: "heading",
        depth: 2,
        children: [
          { type: "text", value: "Table of " },
          {
            type: "strong",
            children: [{ type: "text", value: "Contents" }],
          },
        ],
      };
      const tree = root(richTocHeading, heading(2, "Intro"));
      transform(tree);
      expect(tree.children.some(n => n.type === "html")).toBe(true);
    });

    it("does not modify the tree when there are no headings after the TOC section", () => {
      const tocHeading = heading(2, "Table of Contents");
      const tree = root(tocHeading);
      transform(tree);
      // Plugin bails out early — tree unchanged
      expect(tree.children).toHaveLength(1);
      expect(tree.children[0]).toStrictEqual(tocHeading);
    });
  });

  describe("output structure", () => {
    it("preserves the TOC trigger heading as the first child", () => {
      const tree = root(heading(2, "Table of Contents"), heading(2, "Intro"));
      transform(tree);
      expect(tree.children[0].type).toBe("heading");
      expect((tree.children[0] as Heading).depth).toBe(2);
    });

    it("wraps the list in <details> / </details>", () => {
      const tree = root(heading(2, "Table of Contents"), heading(2, "Intro"));
      transform(tree);
      const htmlValues = tree.children
        .filter(n => n.type === "html")
        .map(n => (n as { type: "html"; value: string }).value);
      expect(htmlValues).toContain("<details>");
      expect(htmlValues).toContain("</details>");
    });

    it("includes a <summary> paragraph with the TOC heading text", () => {
      const tree = root(heading(2, "Table of Contents"), heading(2, "Intro"));
      transform(tree);
      const para = tree.children.find(n => n.type === "paragraph") as
        | Paragraph
        | undefined;
      expect(para).toBeDefined();
      const textNode = para!.children.find(c => c.type === "text") as
        | Text
        | undefined;
      expect(textNode?.value).toBe("Open Table of Contents");
    });

    it("keeps the real content headings in the tree after the details block", () => {
      const tree = root(
        heading(2, "Table of Contents"),
        heading(2, "Introduction"),
        heading(2, "Conclusion")
      );
      transform(tree);
      const headings = tree.children.filter(
        n => n.type === "heading"
      ) as Heading[];
      const texts = headings.flatMap(h =>
        h.children.map(c => (c as Text).value)
      );
      expect(texts).toContain("Introduction");
      expect(texts).toContain("Conclusion");
    });
  });

  describe("list building", () => {
    it("builds a flat list for headings at the same depth", () => {
      const tree = root(
        heading(2, "Table of Contents"),
        heading(2, "Introduction"),
        heading(2, "Body"),
        heading(2, "Conclusion")
      );
      transform(tree);
      const list = tree.children.find(n => n.type === "list") as List;
      expect(list).toBeDefined();
      expect(list.children).toHaveLength(3);
    });

    it("builds a nested list for sub-headings", () => {
      const tree = root(
        heading(2, "Table of Contents"),
        heading(2, "Introduction"),
        heading(3, "Background"),
        heading(3, "Motivation"),
        heading(2, "Conclusion")
      );
      transform(tree);
      const list = tree.children.find(n => n.type === "list") as List;
      expect(list.children).toHaveLength(2); // Introduction + Conclusion

      // Introduction's list item should have a nested list for Background + Motivation
      const introItem = list.children[0] as ListItem;
      const nestedList = introItem.children.find(c => c.type === "list") as
        | List
        | undefined;
      expect(nestedList).toBeDefined();
      expect(nestedList!.children).toHaveLength(2);
    });

    it("list items are unordered and not spread", () => {
      const tree = root(heading(2, "Table of Contents"), heading(2, "Intro"));
      transform(tree);
      const list = tree.children.find(n => n.type === "list") as List;
      expect(list.ordered).toBe(false);
      expect(list.spread).toBe(false);
    });
  });

  describe("anchor link generation", () => {
    it("generates a correct anchor link using github-slugger", () => {
      const tree = root(
        heading(2, "Table of Contents"),
        heading(2, "My Section")
      );
      transform(tree);
      const list = tree.children.find(n => n.type === "list") as List;
      const listItem = list.children[0] as ListItem;
      const para = listItem.children[0] as Paragraph;
      const link = para.children[0] as { type: "link"; url: string };
      expect(link.type).toBe("link");
      expect(link.url).toBe("#my-section");
    });

    it("deduplicates identical heading slugs with a numeric suffix", () => {
      const tree = root(
        heading(2, "Table of Contents"),
        heading(2, "Section"),
        heading(2, "Section") // duplicate
      );
      transform(tree);
      const list = tree.children.find(n => n.type === "list") as List;
      const urls = list.children.map(item => {
        const para = (item as ListItem).children[0] as Paragraph;
        return (para.children[0] as { url: string }).url;
      });
      expect(urls[0]).toBe("#section");
      expect(urls[1]).toBe("#section-1");
    });

    it("accounts for headings before the TOC when deduplicating slugs", () => {
      // 'section' appears before the TOC, so the slugger already consumed that slug.
      // The TOC entry for the same text should get '-1'.
      const tree = root(
        heading(2, "Section"), // comes before TOC — slug #section is already taken
        heading(2, "Table of Contents"),
        heading(2, "Section") // same text — should be #section-1
      );
      transform(tree);
      const list = tree.children.find(n => n.type === "list") as List;
      const para = (list.children[0] as ListItem).children[0] as Paragraph;
      const link = para.children[0] as { url: string };
      expect(link.url).toBe("#section-1");
    });
  });

  describe("deep nesting", () => {
    it("builds a three-level nested list (h2 → h3 → h4)", () => {
      const tree = root(
        heading(2, "Table of Contents"),
        heading(2, "Chapter"),
        heading(3, "Section"),
        heading(4, "Subsection")
      );
      transform(tree);
      const list = tree.children.find(n => n.type === "list") as List;

      // Top level: one item for Chapter
      expect(list.children).toHaveLength(1);

      const chapterItem = list.children[0] as ListItem;
      const sectionList = chapterItem.children.find(c => c.type === "list") as
        | List
        | undefined;
      expect(sectionList).toBeDefined();
      expect(sectionList!.children).toHaveLength(1); // Section

      const sectionItem = sectionList!.children[0] as ListItem;
      const subsectionList = sectionItem.children.find(
        c => c.type === "list"
      ) as List | undefined;
      expect(subsectionList).toBeDefined();
      expect(subsectionList!.children).toHaveLength(1); // Subsection
    });
  });

  describe("non-heading content handling", () => {
    it("removes non-heading nodes that sit inside the trigger section", () => {
      // A paragraph between the TOC heading and the next real heading falls
      // inside the splice range and should be dropped from the output.
      const introPara = {
        type: "paragraph" as const,
        children: [{ type: "text" as const, value: "some intro text" }],
      };
      const tree = root(
        heading(2, "Table of Contents"),
        introPara,
        heading(2, "Real Section")
      );
      transform(tree);

      const plainParas = tree.children.filter(
        n =>
          n.type === "paragraph" &&
          (n as Paragraph).children.every(c => c.type === "text")
      );
      expect(plainParas).toHaveLength(0);
    });
  });

  describe("section boundary detection", () => {
    it("stops collecting TOC content at the next heading of the same depth", () => {
      const tree = root(
        heading(2, "Table of Contents"),
        heading(2, "Real Section A"), // same depth → marks end of TOC section
        heading(2, "Real Section B")
      );
      transform(tree);
      const list = tree.children.find(n => n.type === "list") as List;
      // Both Real Section A and B should appear as TOC entries
      expect(list.children).toHaveLength(2);
    });

    it("stops collecting at a heading shallower than the trigger", () => {
      // h3 TOC, then an h2 → the h2 is shallower, so it ends the trigger section.
      // Both the h2 and the subsequent h3 become TOC entries.
      const tree = root(
        heading(3, "Table of Contents"),
        heading(2, "Top Level"), // shallower than h3 → ends trigger section; becomes first TOC entry
        heading(3, "Sub Section") // nested under Top Level in the TOC
      );
      transform(tree);
      const list = tree.children.find(n => n.type === "list") as List;
      // Top Level is the single top-level TOC entry
      expect(list.children).toHaveLength(1);
      // Sub Section is nested inside Top Level's list item
      const topItem = list.children[0] as ListItem;
      const nestedList = topItem.children.find(c => c.type === "list") as
        | List
        | undefined;
      expect(nestedList).toBeDefined();
      expect(nestedList!.children).toHaveLength(1);
    });
  });
});
