import { useEffect, useRef } from "react";

/**
 * Observe a sentinel element; call `onIntersect` when it enters the viewport.
 * Interview tip: keep the observer options stable; recreate only when root/rootMargin/threshold change.
 */
export function useIntersectionSentinel({
  enabled,
  onIntersect,
  root = null,
  rootMargin = "200px",
  threshold = 0,
}: {
  enabled: boolean;
  onIntersect: () => void;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const node = sentinelRef.current;

    // TODO(interview): early-return when !enabled || !node
    if (!enabled || !node) {
      return;
    }

    // TODO(interview): create IntersectionObserver → if entry.isIntersecting, call onIntersectRef.current()
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onIntersectRef.current();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [enabled, root, rootMargin, threshold]);

  return sentinelRef;
}
