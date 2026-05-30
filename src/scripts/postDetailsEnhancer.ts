import { createTeardownBag, type Teardown } from "@/scripts/lifecycle";

let activeTeardown: Teardown | undefined;

/**
 * Creates the post details enhancer with scroll progress and heading links
 *
 * @param doc - The document to enhance (defaults to global document)
 */
function createPostDetailsEnhancer(doc: Document) {
  const lifecycle = createTeardownBag();

  /**
   * Binds scroll progress tracking to update the progress bar width
   */
  function bindScrollProgress() {
    const myBar = doc.getElementById("myBar");
    if (!myBar) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const winScroll = doc.documentElement.scrollTop;
        const height =
          doc.documentElement.scrollHeight - doc.documentElement.clientHeight;
        const safeHeight = Math.max(1, height);
        const scrolled = (winScroll / safeHeight) * 100;
        myBar.style.width = `${scrolled}%`;
        ticking = false;
      });
    };

    lifecycle.listen(doc, "scroll", onScroll, { passive: true });
    onScroll();
  }

  /**
   * Adds anchor links to all headings in the article
   */
  function decorateHeadingLinks() {
    const headings = Array.from(doc.querySelectorAll("h2, h3, h4, h5, h6"));

    for (const heading of headings) {
      if (!heading.id) continue;
      if (heading.querySelector("a.heading-link")) continue;

      heading.classList.add("group");

      const link = doc.createElement("a");
      link.className =
        "heading-link ms-2 no-underline opacity-75 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100";
      link.href = `#${heading.id}`;

      const span = doc.createElement("span");
      span.ariaHidden = "true";
      span.innerText = "#";
      link.appendChild(span);
      heading.appendChild(link);
    }
  }

  /**
   * Resets scroll position after Astro view transitions
   */
  function bindAfterSwapScrollReset() {
    lifecycle.listen(doc, "astro:after-swap", () => {
      window.scrollTo({ left: 0, top: 0, behavior: "instant" });
    });
  }

  return {
    init() {
      bindScrollProgress();
      decorateHeadingLinks();
      bindAfterSwapScrollReset();
    },
    destroy() {
      lifecycle.flush();
    },
  };
}

/**
 * Mounts the post details enhancer if an article element exists
 *
 * @param doc - The document to enhance (defaults to global document)
 */
export function mountPostDetailsEnhancer(doc: Document = document) {
  const article = doc.getElementById("article");
  if (!(article instanceof HTMLElement)) {
    activeTeardown?.();
    activeTeardown = undefined;
    return;
  }

  activeTeardown?.();

  const enhancer = createPostDetailsEnhancer(doc);
  enhancer.init();
  activeTeardown = () => enhancer.destroy();
}
