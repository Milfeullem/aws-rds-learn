/**
 * Infinite Scroll — practice skeleton
 *
 * Goal (45–60 min):
 * 1. First page on mount
 * 2. IntersectionObserver sentinel → load next cursor page
 * 3. Append items (don’t replace)
 * 4. Guard: no duplicate in-flight loads; ignore stale / aborted responses
 * 5. Filter change → reset list + cursor
 * 6. Status: loading / empty / error(+retry) / end
 *
 * Wire in src/App.tsx:
 *   import App from './components/InfiniteScroll/App'
 *
 * Self-check: open App.solution.tsx after you finish.
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

  // TODO: keep nextCursor in a ref or state — which and why?
  const cursorRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  const baseId = useId();
  const listId = `${baseId}-list`;
  const filterId = `${baseId}-filter`;

  /**
   * TODO(interview): implement loadPage({ reset })
   * - reset=true: abort previous, clear items, cursor=null, fetch first page
   * - reset=false: if !hasMore || loading → return; fetch with cursorRef.current
   * - on success: append (or replace if reset); update cursor / hasMore / status
   * - on abort/stale requestId: ignore
   * - on error: set status error (only if this request is still current)
   */
  const loadPage = useCallback(async ({ reset }: { reset: boolean }) => {
    void reset;
    void mockFetchFeedPage;
    // YOUR CODE HERE
  }, []);

  // TODO: initial load + reload when query changes (debounce optional)
  useEffect(() => {
    // loadPage({ reset: true })
  }, [loadPage, query]);

  const onRetry = () => {
    // TODO: if items empty → reset load; else continue from current cursor
  };

  const canLoadMore =
    hasMore && status !== "loading" && status !== "error" && items.length > 0;

  const sentinelRef = useIntersectionSentinel({
    enabled: canLoadMore,
    // TODO: call loadPage({ reset: false }) — wrap in useCallback if needed
    onIntersect: () => {
      // loadPage({ reset: false })
    },
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
