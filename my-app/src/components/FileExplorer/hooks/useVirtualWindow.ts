import { useEffect, useState } from "react";
import type { RefObject } from "react";

type UseVirtualWindowOptions = {
  containerRef: RefObject<HTMLElement | null>;
  itemCount: number;
  itemHeight: number;
  overscan?: number;
};

export type VirtualWindow = {
  start: number;
  end: number;
  offsetY: number;
  totalHeight: number;
};

/** Fixed-row-height window over a scroll container. */
export function useVirtualWindow({
  containerRef,
  itemCount,
  itemHeight,
  overscan = 5,
}: UseVirtualWindowOptions): VirtualWindow {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => setScrollTop(el.scrollTop);
    const syncHeight = () => setViewportHeight(el.clientHeight);

    syncHeight();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(syncHeight);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [containerRef]);

  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
  const end = Math.min(itemCount - 1, start + visibleCount);

  return {
    start,
    end: itemCount === 0 ? -1 : end,
    offsetY: start * itemHeight,
    totalHeight: itemCount * itemHeight,
  };
}
