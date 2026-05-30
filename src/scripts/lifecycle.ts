export type Teardown = () => void;

/**
 * Creates a teardown bag for managing cleanup of event listeners and other resources.
 *
 * @returns An object with methods to add teardowns, listen to events, and flush all teardowns
 *
 * @example
 * ```ts
 * const lifecycle = createTeardownBag();
 * lifecycle.listen(button, 'click', handleClick);
 * // Later, clean up all listeners
 * lifecycle.flush();
 * ```
 */
export function createTeardownBag() {
  const teardowns: Teardown[] = [];

  return {
    /**
     * Adds a teardown function to be called during cleanup
     */
    add(teardown: Teardown) {
      teardowns.push(teardown);
    },
    /**
     * Adds an event listener and registers its removal for cleanup
     */
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
    /**
     * Executes all teardown functions and clears the bag
     */
    flush() {
      while (teardowns.length > 0) {
        teardowns.pop()?.();
      }
    },
  };
}
