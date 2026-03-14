import type { Heading, List, ListItem, Root, RootContent } from "mdast";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";

/**
 * Custom remark plugin that generates a collapsible table of contents.
 * Replaces both `remark-toc` and `remark-collapse` in a single pass.
 *
 * Finds a heading matching "Table of contents", collects all subsequent
 * headings, builds a linked list, and wraps it in a <details> element.
 */
export function remarkTocCollapse() {
  return (tree: Root) => {
    const triggerIndex = tree.children.findIndex(
      node =>
        node.type === "heading" &&
        /^(table[ -]of[ -])?contents?$/i.test(toString(node).trim())
    );

    if (triggerIndex === -1) return;

    const triggerHeading = tree.children[triggerIndex] as Heading;
    const triggerDepth = triggerHeading.depth;

    // Find the end of the trigger section (next heading of same or higher level)
    let endIndex = -1;
    for (let i = triggerIndex + 1; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === "heading" && node.depth <= triggerDepth) {
        endIndex = i;
        break;
      }
    }
    if (endIndex === -1) endIndex = tree.children.length;

    // Generate slugs using github-slugger (same algorithm Astro uses).
    // We must slug ALL headings in document order so the stateful slugger
    // produces the same IDs as Astro's rehype pipeline.
    const slugger = new GithubSlugger();
    const slugMap = new Map<Heading, string>();
    for (const node of tree.children) {
      if (node.type === "heading") {
        slugMap.set(node, slugger.slug(toString(node)));
      }
    }

    // Collect all headings after the trigger section for the TOC.
    // Store the AST node reference so we can look up slugs in O(1).
    const headings: Heading[] = [];
    for (let i = endIndex; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === "heading") {
        headings.push(node);
      }
    }

    if (headings.length === 0) return;

    // Build a nested list from the collected headings
    const minDepth = Math.min(...headings.map(h => h.depth));
    const tocList = buildList(headings, minDepth, slugMap);

    // Build the details/summary wrapper with the TOC inside
    const replacement: RootContent[] = [
      triggerHeading,
      { type: "html", value: "<details>" },
      {
        type: "paragraph",
        children: [
          { type: "html", value: "<summary>" },
          { type: "text", value: "Open " + toString(triggerHeading) },
          { type: "html", value: "</summary>" },
        ],
      },
      tocList,
      { type: "html", value: "</details>" },
    ];

    tree.children.splice(triggerIndex, endIndex - triggerIndex, ...replacement);
  };
}

/**
 * Build a nested unordered list from heading nodes.
 */
function buildList(
  headings: Heading[],
  minDepth: number,
  slugMap: Map<Heading, string>
): List {
  const items = buildListItems(headings, 0, minDepth, slugMap);
  return {
    type: "list",
    ordered: false,
    spread: false,
    children: items.items,
  };
}

function buildListItems(
  headings: Heading[],
  idx: number,
  currentDepth: number,
  slugMap: Map<Heading, string>
): { items: ListItem[]; nextIdx: number } {
  const items: ListItem[] = [];

  while (idx < headings.length) {
    const node = headings[idx];

    if (node.depth < currentDepth) {
      break;
    }

    if (node.depth === currentDepth) {
      const text = toString(node);
      const listItem: ListItem = {
        type: "listItem",
        spread: false,
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "#" + slugMap.get(node),
                children: [{ type: "text", value: text }],
              },
            ],
          },
        ],
      };

      // Check if next headings are deeper (children)
      idx++;
      if (idx < headings.length && headings[idx].depth > currentDepth) {
        const nested = buildListItems(
          headings,
          idx,
          headings[idx].depth,
          slugMap
        );
        listItem.children.push({
          type: "list",
          ordered: false,
          spread: false,
          children: nested.items,
        });
        idx = nested.nextIdx;
      }

      items.push(listItem);
    } else {
      // Deeper heading without a parent at currentDepth -- treat as current level
      const nested = buildListItems(headings, idx, node.depth, slugMap);
      items.push(...nested.items);
      idx = nested.nextIdx;
    }
  }

  return { items, nextIdx: idx };
}
