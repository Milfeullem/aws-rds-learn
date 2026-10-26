import { useEffect, useRef } from "react";

/**
 * Interval autoplay with pause + cleanup.
 *
 * Interview tips:
 * - Prefer setInterval + clear on deps change / unmount (avoid stacked timers).
 * - Keep `onTick` in a ref so the interval effect does NOT restart every render.
 * - Pause when hovered, focused inside, tab hidden, or prefers-reduced-motion.
 */
export function useAutoPlay({
  enabled,
  intervalMs,
  onTick,
}: {
  enabled: boolean;
  intervalMs: number;
  onTick: () => void;
}) {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    // TODO(interview): early-return when !enabled || intervalMs <= 0
    if (!enabled || intervalMs <= 0) {
      return;
    }

    // TODO(interview): setInterval → onTickRef.current(); return clearInterval
    const id = window.setInterval(() => {
      onTickRef.current();
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);
}
