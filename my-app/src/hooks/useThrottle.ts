import { useEffect, useRef, useState } from "react";

/**
 * Throttle a value: update at most once per `delayMs` while it keeps changing.
 *
 * Interview tips:
 * - Debounce = wait until quiet; throttle = sample during continuous events.
 * - Leading update on first change, then gate subsequent updates by elapsed time.
 * - Keep a trailing timer so the *latest* value still lands after the window.
 */
export function useThrottle<T>(value: T, delayMs: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastUpdatedAtRef = useRef(0);
  const latestValueRef = useRef(value);

  latestValueRef.current = value;

  useEffect(() => {
    if (delayMs <= 0) {
      setThrottled(value);
      lastUpdatedAtRef.current = Date.now();
      return;
    }

    const now = Date.now();
    const elapsed = now - lastUpdatedAtRef.current;

    if (elapsed >= delayMs) {
      setThrottled(value);
      lastUpdatedAtRef.current = now;
      return;
    }

    const timer = window.setTimeout(() => {
      setThrottled(latestValueRef.current);
      lastUpdatedAtRef.current = Date.now();
    }, delayMs - elapsed);

    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return throttled;
}
