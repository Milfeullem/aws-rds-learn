# Infinite Scroll — Interview Talking Points

Verbal scripts for explaining while coding. Speak decisions, not line-by-line narration.

Practice files: `my-app/src/components/InfiniteScroll/`  
Skeleton: `App.tsx` · Reference: `App.solution.tsx`

---

## Opening (1–2 min)

> I’ll build a cursor-based infinite feed: first page on mount, a sentinel at the bottom observed with IntersectionObserver, and append-only updates.
> Filter changes reset the list and cursor. I’ll guard against duplicate in-flight requests and ignore aborted or stale responses—same race pattern as async search.

> Data flow: `query → (optional debounce) → loadPage(reset) → items[] + nextCursor`. Scroll near bottom → `loadPage(reset: false)`.

---

## While coding (decision points)

| You’re writing… | Say… |
|-----------------|------|
| Cursor vs page number | I’m using an opaque `nextCursor` from the API. That’s how real feeds avoid off-by-one and deleted-item gaps when the list mutates between requests. |
| Append, don’t replace | Next page merges with `[...prev, ...page.items]`. Only a filter/reset replaces the array. |
| `loadingRef` | Observer can fire multiple times while one request is in flight. A ref guard is sync; React state alone would still schedule a second fetch before the first `setStatus` flushes. |
| AbortController + requestId | Abort cancels the network/timer; requestId ignores late responses if a newer reset already started. Belt and suspenders—same as AsyncSearch. |
| Cursor in a ref | The next cursor isn’t rendered; putting it in a ref avoids stale closures without adding render noise. `hasMore` stays in state so the UI can show “end”. |
| Sentinel + `rootMargin` | A 200px `rootMargin` prefetches before the user hits the absolute bottom—feels smoother without a “Load more” click. |
| Disable observer while loading / error / end | `enabled: canLoadMore` prevents a tight loop of intersect → fetch → still intersecting → fetch again. |
| Filter = full reset | New query aborts the old request, clears items, sets cursor to `null`, loads page one. Otherwise you’d append page-2-of-old-filter under new results. |
| Status model | `loading` / `success` / `empty` / `error` / `end`. Empty is only for “first page returned zero”; end means we had items and `hasMore` is false. |
| Retry | If the list is empty, retry as reset; if we already have items, retry the next page from the current cursor. |
| Keys | Stable `item.id` from the API—never use the array index when appending pages. |

---

## Mental model (if they ask)

> **Infinite scroll ≠ virtualization.** Infinite scroll is about *when* you fetch more data. Virtualization is about *how many DOM nodes* you keep. You can have either, both, or neither.
> Sentinel pattern: one empty div after the list; when it intersects the scroll root, request the next page.
> Alternative: `scroll` listener + `scrollTop + clientHeight >= scrollHeight - threshold`. Observer is usually cleaner and doesn’t need a scrollable-container ref unless the list scrolls inside a div (then pass `root`).

---

## Accessibility (say while wiring a11y)

> Status region with `aria-live="polite"` so screen readers hear loading / error / end without stealing focus.
> The sentinel is `aria-hidden`—it’s a fetch trigger, not content.
> Filter input has a visible `<label>`. List has a labeled region (`aria-labelledby`).
> Follow-up if there’s time: a “Load more” button as progressive enhancement when IntersectionObserver isn’t available, or for keyboard-only users who never scroll the sentinel into view.

---

## Trade-offs / follow-ups (pick 2–3)

> No debounce on filter yet—fine for a mock; for a real API I’d debounce 300ms like AsyncSearch so we don’t reset-fetch on every keystroke.

> Duplicate items: if the backend can return overlapping cursors, I’d dedupe by `id` when appending (`Map` or filter).

> Very long feeds: appending forever grows DOM/memory. Next step is windowing (react-window / custom virtual list) *on top of* cursor pagination.

> Bi-directional / chat-style infinite scroll (load older above) needs scroll anchoring (`overflow-anchor` or manual `scrollTop` restore)—different problem.

> `scroll` restoration when navigating away and back would need caching the page window or using a library/router scroll store.

> Server Components / React Query: `useInfiniteQuery` gives pages, `fetchNextPage`, and stale handling out of the box—I’d still explain the same race and reset semantics.

---

## Wrap-up (~30s)

> What works today: cursor pages, sentinel prefetch, append-only merge, filter reset, abort/stale guards, loading/empty/error/end + retry.
> Structure: presentational list/status; fetch + observer wiring in the page (or a `useInfiniteFeed` hook).
> Known gaps: debounce on filter, virtualization, explicit “Load more” fallback.
> If we have time, I’d extract `useInfiniteFeed` and add debounced query next.

---

## Accessibility one-liner

> Live status for async updates; labeled filter and list; sentinel hidden from AT; optional Load-more button so keyboard users aren’t stuck.

---

## Cheat-sheet: loadPage pseudocode

```
loadPage({ reset }):
  if !reset && (loading || !hasMore): return
  abort previous
  bump requestId; loading = true
  if reset: cursor = null; clear items
  set status loading
  try:
    page = await api({ cursor, query, signal })
    if stale: return
    cursor = page.nextCursor
    items = reset ? page.items : items + page.items
    status = empty | end | success
  catch:
    if aborted/stale: return
    status = error
  finally:
    if current: loading = false
```

---

## Demo script (2 min after coding)

1. Load page → scroll → watch pages append (`slow` filter to see loading).
2. Filter `React` → list resets, new pages.
3. Filter `error` → error + Retry.
4. Scroll to end → status `end`, sentinel gone / observer disabled.
