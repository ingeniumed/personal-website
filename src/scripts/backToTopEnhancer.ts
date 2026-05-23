import {
  createPageLoadStarter,
  createTeardownBag,
  type Teardown,
} from "@/scripts/lifecycle";

let activeTeardown: Teardown | undefined;

function createBackToTopEnhancer(doc: Document) {
  const lifecycle = createTeardownBag();

  function init() {
    const rootElement = doc.documentElement;
    const btnContainer = doc.querySelector("#btt-btn-container");
    const backToTopBtn = doc.querySelector("[data-button='back-to-top']");
    const progressIndicator = doc.querySelector("#progress-indicator");

    if (
      !(btnContainer instanceof HTMLElement) ||
      !(backToTopBtn instanceof HTMLElement) ||
      !(progressIndicator instanceof HTMLElement)
    )
      return;

    lifecycle.listen(backToTopBtn, "click", () => {
      doc.body.scrollTop = 0;
      doc.documentElement.scrollTop = 0;
    });

    let lastVisible: boolean | null = null;
    const handleScroll = () => {
      const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
      const safeScrollTotal = Math.max(1, scrollTotal);
      const scrollTop = rootElement.scrollTop;
      const scrollPercent = Math.floor((scrollTop / safeScrollTotal) * 100);

      progressIndicator.style.setProperty(
        "background-image",
        `conic-gradient(var(--accent), var(--accent) ${scrollPercent}%, transparent ${scrollPercent}%)`
      );

      const isVisible = scrollTop / safeScrollTotal > 0.3;

      if (isVisible !== lastVisible) {
        btnContainer.classList.toggle("opacity-100", isVisible);
        btnContainer.classList.toggle("translate-y-0", isVisible);
        btnContainer.classList.toggle("opacity-0", !isVisible);
        btnContainer.classList.toggle("translate-y-14", !isVisible);
        lastVisible = isVisible;
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    };

    lifecycle.listen(doc, "scroll", onScroll, { passive: true });
    handleScroll();
  }

  return {
    init,
    destroy() {
      lifecycle.flush();
    },
  };
}

export function mountBackToTopEnhancer(doc: Document = document) {
  const container = doc.getElementById("btt-btn-container");
  if (!(container instanceof HTMLElement)) {
    activeTeardown?.();
    activeTeardown = undefined;
    return;
  }

  activeTeardown?.();

  const enhancer = createBackToTopEnhancer(doc);
  enhancer.init();
  activeTeardown = () => enhancer.destroy();
}

export const startBackToTopEnhancer = createPageLoadStarter(
  mountBackToTopEnhancer
);
