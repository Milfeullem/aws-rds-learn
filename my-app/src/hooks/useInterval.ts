import { useEffect, useRef } from "react";

/**
 * Declarative `setInterval` that always calls the latest callback.
 *
 * Interview tips (Dan Abramov pattern):
 * - Stale closure: `setInterval(() => console.log(count), 1000)` with `[]` forever sees mount count.
 * - Keep `callback` in a ref so the interval effect only depends on `delay`.
 * - Pass `null` delay to pause (no need for a separate `enabled` flag).
 * - Always clear on delay change / unmount to avoid stacked timers.
 */
export function useInterval(callback: () => void, delayMs: number | null) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs == null || delayMs < 0) {
      return;
    }

    const id = window.setInterval(() => {
      callbackRef.current();
    }, delayMs);

    return () => window.clearInterval(id);
  }, [delayMs]);
}
