# React Mid-Level — 30 Questions (English)

~30-second spoken answers. Tie each answer to code you’ve practiced when you can.

Practice map: AsyncSearch · InfiniteScroll · NestedComments · Autocomplete · Modal · Tabs · Todo · FileExplorer

---

## A. Render & State (1–6)

### 1. What causes a React component to re-render?

> A re-render happens when its state changes, its props change, or its parent re-renders and passes new prop references. Context updates also re-render consumers. Changing a ref does **not** re-render.

### 2. `useState` vs `useRef` — when do you use each?

> `useState` for values that should show up in the UI. `useRef` for mutable values that must survive renders without triggering one—DOM nodes, AbortControllers, request ids, “am I loading” guards. Same pattern as `requestIdRef` / `loadingRef` in AsyncSearch and Infinite Scroll.

### 3. What is a stale closure, and how do you fix it?

> An effect or callback captured an old state/props value from a previous render. Fixes: put the value in the dependency array, use the functional updater `setX(prev => …)`, or read the latest value from a ref. Interview classic: a `setInterval` that always sees `count === 0`.

### 4. Why shouldn’t you use the array index as `key` when the list can reorder or grow?

> Keys tell React which item is which. Indexes shift when you insert, delete, or append pages, so React can reuse the wrong DOM node and mix up focus, input state, or animations. Prefer stable ids (`item.id`)—especially with Infinite Scroll appends and Todo CRUD.

### 5. Controlled vs uncontrolled inputs?

> Controlled: React state is the source of truth (`value` + `onChange`). Uncontrolled: the DOM holds the value; you read it via a ref on submit. Prefer controlled for search, filters, and forms that validate or sync UI. Uncontrolled is fine for simple one-shot fields.

### 6. Where should state live?

> Shared or business state lifts to the nearest common parent (todo list, comment tree). Ephemeral UI state stays local (input draft, “is reply form open”, hover). Don’t put collapse/reply flags into every comment object if only the view needs them.

---

## B. Hooks (7–12)

### 7. Explain `useEffect` dependency arrays.

> `[]` — run after mount, clean up on unmount. `[a, b]` — run when those values change. Omit the array — run after every paint (rarely what you want). The cleanup function cancels subscriptions, timers, and in-flight work (abort fetch).

### 8. What belongs in an effect cleanup?

> Anything that shouldn’t outlive this effect run: `clearTimeout`, `removeEventListener`, `observer.disconnect()`, `AbortController.abort()`. In AsyncSearch, aborting the previous request on query change or unmount prevents setState-after-unmount and race bugs.

### 9. `useMemo` vs `useCallback` — do you need them by default?

> No. Use them when you have a measurable cost (heavy derive) or when you pass a stable function/object into a memoized child / dependency array. Premature memo adds noise and can hide bugs. Prefer clean state design first.

### 10. Rules of Hooks — why no conditional hooks?

> Hooks rely on call order to match state across renders. Calling them inside `if` / loops breaks that order and corrupts state. Always call hooks at the top level of a function component or custom hook.

### 11. How do you design a custom hook?

> Extract reusable stateful logic, return values and callbacks—not JSX. Examples: `useDebouncedValue`, `useIntersectionSentinel`, `useControllableState`. Name it `useX`, keep one clear responsibility, and document when the consumer must memoize callbacks.

### 12. `useId` — what is it for?

> Stable, unique ids for accessibility wiring (`htmlFor`, `aria-controls`, `aria-labelledby`) that stay consistent across SSR/client when needed. Prefer it over hard-coded `"search-input"` when multiple instances can mount.

---

## C. Async & Data (13–17)

### 13. How do you handle race conditions in search?

> Debounce the query, abort the previous request with `AbortController`, and ignore responses whose `requestId` isn’t current. Fast typing can resolve out of order; without guards, an older response can overwrite newer results. That’s the AsyncSearch story.

### 14. Debounce vs throttle?

> Debounce: wait until the user pauses, then run once (search-as-you-type). Throttle: run at most once per interval while events keep firing (scroll handlers). Infinite Scroll usually prefers IntersectionObserver over a throttled scroll listener.

### 15. How do you model async UI status?

> Explicit states: `idle | loading | success | empty | error` (and `end` for infinite scroll). Don’t overload a single boolean `isLoading`. Empty and error need different UI and copy; retry should be obvious.

### 16. Cursor pagination vs page numbers?

> Cursors (`nextCursor`) match real feeds and stay correct when items are inserted/deleted between requests. Page numbers are simpler for static catalogs but can skip/duplicate under mutation. Infinite Scroll demos should use cursors and **append**, not replace.

### 17. How do you prevent duplicate fetches when the sentinel stays visible?

> Gate with a sync `loadingRef`, disable the observer while `loading` / `error` / `!hasMore`, and no-op `loadMore` if a request is in flight. IntersectionObserver can fire repeatedly; React state alone updates too late to stop the second call.

---

## D. Lists, Trees & Structure (18–22)

### 18. Infinite scroll vs virtualization — what’s the difference?

> Infinite scroll decides **when** to fetch more data. Virtualization decides **how many DOM nodes** to keep mounted. You can combine them: cursor pages + a windowed list for very long feeds.

### 19. Nested comments — tree vs flat map?

> Nested `children[]` is intuitive to render recursively and fine for interviews. A flat `id → node` + `parentId` map is better for O(1) updates, moves, and large threads. Say you’d start nested and normalize if edit/move/lazy-load gets hard.

### 20. How do you update a tree immutably?

> Recursively `map`/`filter`, copy only the path you change: `{ ...node, children: [...] }`. Never `push` into existing arrays. Same idea as `appendComment` / `removeComment`—delete removes the whole subtree.

### 21. Why keep `collapsedIds` / `replyTargetId` outside the comment model?

> They’re view concerns. Mixing them into every comment couples UI chrome to data, complicates persistence, and makes “one open reply form” awkward. Root owns a `Set` and a single `replyTargetId`.

### 22. File explorer / large trees — what breaks first?

> Recursively mounting thousands of DOM nodes. Mitigations: flatten visible nodes, virtualize the list, debounce search, and keep expand state in a `Set`. Filtering should preserve ancestors of matches so deep hits stay reachable.

---

## E. Components, A11y & Browser APIs (23–27)

### 23. How would you explain a Modal implementation?

> Prefer a dialog pattern: portal to `document.body`, focus trap, restore focus on close, `Escape` to dismiss, lock background scroll, and proper labeling (`aria-modal`, labelledby). Don’t only toggle CSS `display`.

### 24. Tabs — what a11y details matter?

> `role="tablist" / tab / tabpanel"`, `aria-selected`, keyboard arrows (and Home/End), and only the active tab in the tab order (`tabIndex={0}` vs `-1`). Controlled `value` + `onChange` if the parent needs to sync URL or analytics.

### 25. Autocomplete / combobox mental model?

> Focus stays on the input; the list is a `listbox`; highlight via `aria-activedescendant`, not by moving focus into each option. Handle Arrow keys, Enter, Escape, click-outside, and `mousedown preventDefault` on options so blur doesn’t swallow the click.

### 26. Why `IntersectionObserver` for infinite scroll?

> It fires when a sentinel enters the viewport (optionally with `rootMargin` to prefetch). You avoid manual scroll math and many scroll listeners. Pass a custom `root` if the list scrolls inside a div, not the window.

### 27. Portal — when do you need it?

> When stacking context / overflow / z-index would clip the UI—modals, popovers, toasts. `createPortal(node, document.body)` renders under `body` while React ownership stays with the parent (context still flows).

---

## F. Performance, Architecture & Trade-offs (28–30)

### 28. How do you approach React performance in an interview?

> Measure first (React Profiler / slow interaction). Fix unnecessary state at the top, shrink context value churn, then memoize hot children. For lists, virtualize before micro-optimizing hooks. Don’t lead with `useMemo` everywhere.

### 29. What would you use React Query / SWR for?

> Server cache, deduping, retries, stale-while-revalidate, and `useInfiniteQuery` for pages. I’d still explain abort/reset semantics myself; the library doesn’t remove the need to reset the list when the filter changes.

### 30. Virtual DOM / reconciliation — 30-second version?

> React computes a new element tree and diffs it against the previous one. Same component type + matching `key` → update that fiber; different type → replace. Keys guide list matching. You don’t need Fiber internals for mid-level—know that **state updates schedule work** and reconciliation decides the minimal DOM update.

---

## Quick drill (pick 5 before a call)

1. Race conditions in search  
2. `useEffect` cleanup  
3. Controlled vs uncontrolled  
4. Infinite scroll vs virtualization  
5. Tree immutable update + where UI state lives  

---

## Tie-back cheat sheet

| Topic | Your practice |
|-------|----------------|
| Debounce + abort + requestId | AsyncSearch |
| Sentinel + loadingRef + cursor | InfiniteScroll |
| Recursive tree + Set collapse | NestedComments |
| Combobox a11y | Autocomplete |
| Portal / focus / Escape | Modal |
| ARIA tabs | Tabs |
| State colocation | TodoList |
| Flatten + virtual window | FileExplorer |
