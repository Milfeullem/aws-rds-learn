import { useEffect, useRef } from "react";

/**
 * Return the value from the *previous* render (undefined on first render).
 *
 * Interview tips:
 * - Refs persist across renders without causing a re-render.
 * - Read `ref.current` during render → still holds last commit's value.
 * - Write in `useEffect` → runs *after* paint, so this render sees the old value.
 * - Pattern: compare prev vs current for “did X change?” without extra state.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
