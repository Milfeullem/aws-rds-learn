/**
 * Reference solution — compare after you finish the skeleton.
 * To run: in src/App.tsx
 *   import App from './components/InfiniteScroll/App.solution'
 */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import "./styles.css";

import { mockFetchFeedPage } from "./mockApi";
import { useIntersectionSentinel } from "./hooks/useIntersectionSentinel";
import FeedList from "./components/FeedList";
import FeedStatus from "./components/FeedStatus";
import type { FeedItem, FeedStatus as Status } from "./types";

const PAGE_SIZE = 12;

export default function App() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  const baseId = useId();
  const listId = `${baseId}-list`;
  const filterId = `${baseId}-filter`;

  const loadPage = useCallback(async ({ reset }: { reset: boolean }) => {
    if (!reset && (loadingRef.current || !hasMoreRef.current)) {
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    loadingRef.current = true;

    if (reset) {
      cursorRef.current = null;
      hasMoreRef.current = true;
      setItems([]);
      setHasMore(true);
    }

    setStatus("loading");
    setError(null);

    try {
      const page = await mockFetchFeedPage({
        cursor: reset ? null : cursorRef.current,
        limit: PAGE_SIZE,
        query,
        signal: controller.signal,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      cursorRef.current = page.nextCursor;
      hasMoreRef.current = page.hasMore;
      setHasMore(page.hasMore);
      setItems((prev) => (reset ? page.items : [...prev, ...page.items]));

      if (reset && page.items.length === 0) {
        setStatus("empty");
      } else if (!page.hasMore) {
        setStatus("end");
      } else {
        setStatus("success");
      }
    } catch (err) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown feed error.");
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
      }
    }
  }, [query]);

  useEffect(() => {
    void loadPage({ reset: true });

    return () => {
      controllerRef.current?.abort();
    };
  }, [loadPage]);

  const onRetry = () => {
    void loadPage({ reset: items.length === 0 });
  };

  const loadMore = useCallback(() => {
    void loadPage({ reset: false });
  }, [loadPage]);

  const canLoadMore =
    hasMore && status !== "loading" && status !== "error" && items.length > 0;

  const sentinelRef = useIntersectionSentinel({
    enabled: canLoadMore,
    onIntersect: loadMore,
  });

  return (
    <main className="app">
      <section className="hero" aria-labelledby="feed-title">
        <p className="eyebrow">Premium React Case</p>
        <h1 id="feed-title">Infinite Scroll Feed</h1>
        <p>
          Cursor pages + sentinel observer. Try filter{" "}
          <code>error</code> / <code>slow</code> / <code>React</code>.
        </p>
      </section>

      <div className="feed-toolbar">
        <label htmlFor={filterId}>
          Filter
          <input
            id={filterId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="category or title…"
            autoComplete="off"
          />
        </label>
      </div>

      <FeedStatus status={status} error={error} onRetry={onRetry} />

      <FeedList
        items={items}
        status={status}
        listId={listId}
        sentinelRef={sentinelRef}
        showSentinel={canLoadMore || status === "loading"}
      />
    </main>
  );
}
