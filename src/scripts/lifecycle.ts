export type Teardown = () => void;

export function createTeardownBag() {
  const teardowns: Teardown[] = [];

  return {
    add(teardown: Teardown) {
      teardowns.push(teardown);
    },
    listen(
      target: EventTarget,
      event: string,
      handler: EventListener,
      options?: AddEventListenerOptions
    ) {
      target.addEventListener(event, handler, options);
      teardowns.push(() => {
        target.removeEventListener(event, handler, options);
      });
    },
    flush() {
      while (teardowns.length > 0) {
        teardowns.pop()?.();
      }
    },
  };
}

export function createPageLoadStarter(runEnhancer: (doc: Document) => void) {
  let started = false;

  return function start(doc: Document = document) {
    if (started) return;
    started = true;

    const rerun = () => runEnhancer(doc);
    doc.addEventListener("astro:page-load", rerun);
    rerun();
  };
}
