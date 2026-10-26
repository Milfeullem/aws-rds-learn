# React Mid-Level — 30 Questions (English)

Interview-ready answers with a bit more depth than a pure 30-second pitch. Lead with the short verdict, then add the “why / how / edge case.” Tie each answer to code you’ve practiced when you can.

Practice map: AsyncSearch · InfiniteScroll · NestedComments · Autocomplete · Modal · Tabs · Todo · FileExplorer

---

## A. Render & State (1–6)

### 1. What causes a React component to re-render?

> **Short:** State change, props change (usually because the parent re-rendered), or a Context value it consumes changed. Updating a `ref` does **not** re-render.
>
> **Detail:** React re-renders a component when it needs to recompute its output. The common triggers:
> 1. **Own state** — `setState` / `useReducer` dispatch schedules an update for that component (and its subtree).
> 2. **Parent re-render** — even if your props look “the same,” the parent re-running means your function runs again unless you opt out with `memo` *and* props are shallow-equal. New object/array/function props (`style={{}}`, `onClick={() => {}}`) break that equality every time.
> 3. **Context** — any consumer of a Provider re-renders when the Provider’s `value` identity changes, even if you only needed one field. That’s why unstable context values cause broad trees to update.
> 4. **External stores** — `useSyncExternalStore` / libraries that subscribe you to outside data.
>
> **Not a re-render:** mutating `ref.current`, writing to a module variable, or changing the DOM imperatively. Those skip React’s update path—which is exactly why refs are useful for “latest value without paint.”
>
> **Interview tip:** Separate “re-render” (JS function runs) from “DOM commit” (browser updates). Many re-renders are cheap; the expensive part is often large trees or layout work.

### 2. `useState` vs `useRef` — when do you use each?

> **Short:** `useState` when the UI must reflect the value. `useRef` when you need a mutable box that survives renders without scheduling one.
>
> **useState:** Driving visible UI — query text, status, open/closed, selected tab. Updating it is asynchronous and batched; you may need the functional updater `setX(prev => …)` when the next value depends on the previous one.
>
> **useRef:** Three classic jobs:
> 1. Hold a **DOM node** (`inputRef.current.focus()`).
> 2. Hold **imperative / async handles** — `AbortController`, timer ids, IntersectionObserver.
> 3. Hold **“latest without re-render”** flags — `requestIdRef`, `loadingRef`, `onIntersectRef` — so effects and async callbacks always see current values without putting them in dependency arrays.
>
> **Practice:** AsyncSearch uses `controllerRef` + `requestIdRef`; Infinite Scroll uses `loadingRef` / `onIntersectRef` so IntersectionObserver doesn’t close over a stale callback or fire duplicate loads.
>
> **Rule of thumb:** If removing this value from the screen would still leave the app correct, it might belong in a ref. If the user must *see* it change, it belongs in state.

### 3. What is a stale closure, and how do you fix it?

> **Short:** A function (effect, timeout, event handler, promise `.then`) still closes over props/state from an older render, so it reads outdated values.
>
> **Classic demo:**
> ```js
> useEffect(() => {
>   const id = setInterval(() => console.log(count), 1000);
>   return () => clearInterval(id);
> }, []); // count always 0
> ```
> The interval callback was created once and forever sees the mount-time `count`.
>
> **Fixes (pick intentionally):**
> 1. **Dependencies** — put `count` in the array so the effect re-subscribes with a fresh closure (and clean up the old timer).
> 2. **Functional updater** — `setCount(c => c + 1)` doesn’t need the current count in the closure.
> 3. **Ref for latest** — `countRef.current = count` each render; the interval reads `countRef.current`. Useful when you *don’t* want to restart the subscription.
> 4. **Abort / request id** — ignore stale async results instead of applying old state (AsyncSearch pattern).
>
> **Why interviews love this:** It shows you understand that every render creates new closures, and that “async later” is not the same world as “current UI.”

### 4. Why shouldn’t you use the array index as `key` when the list can reorder or grow?

> **Short:** Keys identify identity across renders. Indexes change when the list’s order or membership changes, so React attaches the wrong state/DOM to the wrong item.
>
> **What goes wrong:**
> - Insert at the front / delete in the middle → every later index shifts; focused inputs, controlled field values, and CSS transitions jump to the wrong row.
> - Infinite Scroll **append** is usually fine with indexes *until* you prepend, filter, or reorder—then bugs appear. Prefer stable `item.id` from day one.
> - Reorder (drag-and-drop Kanban, todo sort) with index keys remounts or mismatches children incorrectly.
>
> **When index is OK:** Static lists that never reorder, insert in the middle, or filter—e.g. a fixed settings menu. Still prefer ids if you have them.
>
> **Practice:** Todo CRUD, Infinite Scroll pages, NestedComments nodes—all should key by `id`, not position.

### 5. Controlled vs uncontrolled inputs?

> **Short:** Controlled = React state is the source of truth (`value` + `onChange`). Uncontrolled = the DOM owns the value; you read via `ref` (often on submit) or `defaultValue`.
>
> **Controlled — prefer when:**
> - You validate, format, or disable based on the value.
> - Search, filters, autocomplete: UI (suggestions, clear button, status) must stay in sync with the string.
> - Parent needs the value (lifted state, form libraries’ controlled mode).
>
> **Uncontrolled — fine when:**
> - One-shot fields (“name on submit”), file inputs, or integrating non-React widgets.
> - You want less re-rendering on every keystroke (rare bottleneck; measure first).
>
> **Gotchas:** Don’t mix modes (`value` one render, omit it the next)—React will warn. For Autocomplete/AsyncSearch, controlled query state is the natural fit so debounce, abort, and status UI all share one source of truth.

### 6. Where should state live?

> **Short:** Lift shared/business state to the nearest common parent; keep ephemeral UI state local to the component that owns the interaction.
>
> **Business / shared:** Todo list items, comment tree, selected tab if URL/analytics need it, feed items + cursor. Multiple siblings read or write it → parent (or a small store) owns it.
>
> **Ephemeral UI:** Input draft text before submit, “is this reply form open,” hover, local modal open flag, which comment ids are collapsed. NestedComments keeps `collapsedIds` / `replyTargetId` at the root as view state—not fields on every comment object—so persistence and “only one reply open” stay simple.
>
> **Smell tests:**
> - Prop-drilling three levels only to toggle a boolean → maybe local state or composition.
> - Duplicating the same list in two places → lift or derive one from the other.
> - Putting `isHovered` into the server model → wrong layer.

---

## B. Hooks (7–12)

### 7. Explain `useEffect` dependency arrays.

> **Short:** The array tells React when to re-run the effect after paint. `[]` ≈ mount/unmount; `[a, b]` ≈ those values changed; omitted ≈ every render (almost never what you want).
>
> **Semantics:**
> - **After paint** — effects are for synchronization with something outside React (network, DOM APIs, subscriptions), not for computing render output.
> - **Cleanup** runs before the next effect run *and* on unmount. Always pair setup with teardown.
> - **Exhaustive deps** — if you read a value inside, list it (or intentionally stabilize it with a ref). Omitting deps “to run once” is how stale closures sneak in.
>
> **Mental model:** “What am I syncing, and when does that sync become invalid?” Invalid → cleanup old, set up new.

### 8. What belongs in an effect cleanup?

> **Short:** Anything that must not outlive this effect’s current “subscription”: timers, listeners, observers, in-flight fetches, connections.
>
> **Examples:**
> - `clearTimeout` / `clearInterval`
> - `removeEventListener`
> - `observer.disconnect()` (IntersectionObserver in Infinite Scroll)
> - `AbortController.abort()` (AsyncSearch: abort previous request when query changes or on unmount)
>
> **Why it matters:** Without cleanup you get setState-on-unmounted-component warnings, duplicate listeners, and race conditions where an old response updates new UI. Cleanup is the structured way to say “this generation of the effect is done.”

### 9. `useMemo` vs `useCallback` — do you need them by default?

> **Short:** No. Default to clear state and structure; memoize when you have a measured cost or a referential-stability requirement.
>
> **useMemo:** Cache an expensive derived value between renders when inputs haven’t changed. Not for “make object identity stable” as a habit—often fixing *where* you create the object is better.
>
> **useCallback:** Stabilize a function identity for `memo` children or for inclusion in someone else’s dependency array. Same cost/benefit trade-off as `useMemo(() => fn, deps)`.
>
> **When yes:** Heavy list transforms; context value objects you must keep stable; custom hooks that return callbacks consumed as effect deps (or document that the consumer should memoize).
>
> **When no:** Premature wrapping of every handler—noise, harder debugging, and false confidence. Prefer fewer, better-placed state updates first.

### 10. Rules of Hooks — why no conditional hooks?

> **Short:** React matches hook state to calls by **call order**. Conditional/`for`-loop hooks change that order between renders and corrupt the hook list.
>
> **Implication:** Always call hooks at the top level of a function component or custom hook—same number, same order, every render. Put conditions *inside* the hook or after all hooks:
> ```js
> const data = useQuery(id);
> if (!id) return null; // OK — hooks already ran
> ```
> Conditional *return before hooks* is also illegal for the same reason.
>
> **Custom hooks** are just functions that call hooks—they inherit the same rules and must be called unconditionally from components.

### 11. How do you design a custom hook?

> **Short:** Extract reusable *stateful logic*, return data + callbacks (not JSX). Name it `useX`, one responsibility, clear inputs/outputs.
>
> **Good extractions:** `useDebouncedValue(query, 300)`, `useIntersectionSentinel({ enabled, onIntersect })`, `useControllableState` for controlled/uncontrolled components.
>
> **API design tips:**
> - Accept options objects when there are several knobs (`root`, `rootMargin`).
> - Return refs or tuples consistently; document stability (`onIntersect` may be stored in a ref inside the hook so callers aren’t forced to `useCallback`).
> - Don’t hide too much—callers should still understand loading/error if the hook owns fetching.
>
> **Smell:** A “hook” that returns a full page of JSX is a component; rename it.

### 12. `useId` — what is it for?

> **Short:** Stable unique IDs for accessibility attributes (`htmlFor`, `aria-controls`, `aria-labelledby`, `id` on inputs/panels) that stay consistent when multiple instances mount—and across SSR/hydration when relevant.
>
> **Why not `Math.random()` or a hard-coded `"search-input"`?** Random IDs mismatch server/client HTML; hard-coded IDs collide when two Autocomplete/SearchBox instances exist on one page.
>
> **Practice:** AsyncSearch builds `searchId` / `resultId` from `useId()` so the input and status region can be wired with ARIA without collisions.

---

## C. Async & Data (13–17)

### 13. How do you handle race conditions in search?

> **Short:** Debounce input, abort the previous request, and ignore responses that aren’t for the latest request id. Fast typing finishes out of order; without guards, an older response can overwrite newer results.
>
> **Layered defense (AsyncSearch story):**
> 1. **Debounce** (`useDebouncedValue`) — don’t hit the network on every keystroke.
> 2. **AbortController** — cancel the in-flight fetch when the query changes or the component unmounts; avoids wasted work and many setState-after-unmount cases.
> 3. **requestIdRef** — bump a counter per request; in `.then` / `.catch`, no-op if `requestId !== requestIdRef.current`. Covers cases abort doesn’t (e.g. mock APIs that ignore `signal`, or responses that already resolved).
>
> **Also:** Reset UI appropriately on empty query (idle + clear results). Treat abort errors as non-failures so you don’t flash an error for intentional cancels.

### 14. Debounce vs throttle?

> **Short:** Debounce = run after the user *stops*; throttle = run at most once per interval *while* events continue.
>
> **Debounce:** Search-as-you-type, window resize that recomputes layout, form autosave. You care about the *final* value, not intermediate ones.
>
> **Throttle:** Scroll position reporting, mousemove previews, “button spam” guards. You want periodic samples during a continuous stream.
>
> **Infinite Scroll:** Prefer **IntersectionObserver** over a throttled `scroll` listener—declarative “near the end” detection, fewer main-thread scroll handlers. Use `rootMargin` to prefetch before the user fully hits the bottom.

### 15. How do you model async UI status?

> **Short:** Explicit statuses beat a single `isLoading` boolean: e.g. `idle | loading | success | empty | error`, plus `end` / `!hasMore` for infinite scroll.
>
> **Why:** Empty and error need different copy and actions (retry vs “no results”). Loading over existing data (refresh) differs from first load. Overloading booleans (`loading && !error && data.length===0`) becomes unreadable.
>
> **UI mapping:** idle → prompt; loading → skeleton/spinner; success → list; empty → friendly empty; error → message + retry. Infinite Scroll adds “load more failed” without wiping the already-fetched list.
>
> **Practice:** AsyncSearch `SearchStatus` and Infinite Scroll `FeedStatus` both branch on status, not on inferred flags.

### 16. Cursor pagination vs page numbers?

> **Short:** Cursors (`nextCursor`) fit feeds and stay coherent when the dataset mutates between requests. Page numbers are simpler for stable catalogs but can skip or duplicate rows under inserts/deletes.
>
> **Cursor:** Server returns `items` + opaque `nextCursor` (or null when done). Client **appends** pages. Infinite Scroll demos should append, never replace the whole list on page 2+.
>
> **Page numbers:** `?page=3` is easy to bookmark and reason about for admin tables. Under live writes, item 21 might move; page 2 and page 3 can overlap or leave gaps.
>
> **Filter changes:** Reset cursor, clear items, and bump a generation/request guard—same race mindset as search.

### 17. How do you prevent duplicate fetches when the sentinel stays visible?

> **Short:** Sync gate (`loadingRef`), disable the observer while `loading` / `error` / `!hasMore`, and make `loadMore` a no-op if a request is already in flight. State updates are too slow to stop a second IntersectionObserver callback in the same frame.
>
> **Why it happens:** After the first page, the sentinel may still intersect (short list, large `rootMargin`). The observer fires again before React re-renders `loading === true`.
>
> **Pattern:**
> 1. `loadingRef.current = true` **synchronously** at the start of `loadMore`.
> 2. `enabled: hasMore && !loading && !error` (or similar) so the hook disconnects while busy.
> 3. Cleanup `disconnect` on dependency change (see `useIntersectionSentinel`).
>
> Without the ref, “disable via state” alone often double-fetches in interviews and production.

---

## D. Lists, Trees & Structure (18–22)

### 18. Infinite scroll vs virtualization — what’s the difference?

> **Short:** Infinite scroll decides **when to fetch** more data. Virtualization decides **how many DOM nodes** stay mounted. They solve different bottlenecks and compose well.
>
> **Infinite scroll:** Network/pagination UX—load page N when the user nears the end (sentinel + cursor).
>
> **Virtualization:** Render performance—only mount rows in (and near) the viewport; recycle or unmount the rest. Critical for 10k+ rows even if all data is already in memory.
>
> **Together:** Cursor pages append into an array; a windowed list renders a slice. Don’t claim virtualization when you only implemented “load more.”

### 19. Nested comments — tree vs flat map?

> **Short:** Nested `children[]` is natural for recursive UI and enough for many interviews. A flat `id → node` + `parentId` map wins for O(1) updates, moves, and large/lazy threads.
>
> **Nested pros:** Easy recursive render (`CommentNode` → children). Intuitive mental model.
> **Nested cons:** Updating a deep node copies the path (fine) but finding by id is O(n); moving subtrees and partial fetch get awkward.
>
> **Flat pros:** `Map`/`Record` lookup O(1); update one node without walking; easier normalized caching (think Redux/React Query entity style).
> **Flat cons:** You must build the tree for render (or render from parentId indexes carefully).
>
> **Line to say:** “I’d start nested for the exercise; if edit/move/lazy-load gets hard, normalize to a flat map.”

### 20. How do you update a tree immutably?

> **Short:** Copy only the path you change—`map`/`filter` with `{ ...node, children: [...] }`. Never `push` / `splice` into existing arrays/objects that React already rendered.
>
> **Insert (NestedComments `appendComment`):** If `parentId === null`, `[...tree, next]`. Else `map` nodes; on match, `{ ...node, children: [...node.children, next] }`; else recurse into `children`.
>
> **Delete (`removeComment`):** `filter` out the id at each level, then `map` to replace `children` with a recursive remove—deleting a node drops its whole subtree.
>
> **Why immutability:** React’s bail-outs and `memo` rely on reference changes. Mutating in place can leave the UI stale because React sees the same array reference.

### 21. Why keep `collapsedIds` / `replyTargetId` outside the comment model?

> **Short:** They’re view/session concerns, not domain data. Mixing them into every comment couples UI chrome to the model and makes persistence and invariants harder.
>
> **Examples of pain if mixed in:**
> - Saving comments to an API would send collapse flags unless you strip them.
> - “Only one reply form open” is a single `replyTargetId` at the root—not a boolean on every node that you must clear manually.
> - Collapse is often a `Set` of ids for O(1) toggle; stuffing `collapsed: boolean` on nodes forces deep immutable updates for a pure UI toggle.
>
> **Practice:** Root owns `collapsedIds` + `replyTargetId`; comment objects stay `{ id, author, body, children }`.

### 22. File explorer / large trees — what breaks first?

> **Short:** Recursively mounting thousands of DOM nodes (and deep React trees) kills scroll and expand performance long before “algorithm” issues show up.
>
> **Mitigations:**
> 1. **Flatten visible nodes** — walk expanded paths into a list; render a flat list (easier to virtualize).
> 2. **Virtualize** that list for large folders.
> 3. **Expand state in a `Set`** — don’t store `expanded` on every file node in the source data.
> 4. **Search** — debounce; when filtering, keep ancestors of matches visible so deep hits remain reachable.
>
> **Interview arc:** Correct recursive tree → identify DOM cost → flatten/virtualize as the scaling story.

---

## E. Components, A11y & Browser APIs (23–27)

### 23. How would you explain a Modal implementation?

> **Short:** Treat it as a dialog, not a CSS `display` toggle: portal to `document.body`, focus management, Escape, scroll lock, and correct ARIA.
>
> **Checklist:**
> - **Portal** — escape parent `overflow` / `z-index` / stacking contexts.
> - **Focus** — move focus into the dialog on open; **trap** Tab inside; **restore** focus to the opener on close.
> - **Keyboard** — `Escape` closes (unless you intentionally disable it for critical confirms).
> - **Scroll lock** — prevent background scroll while open.
> - **Semantics** — `role="dialog"` (or `<dialog>`), `aria-modal="true"`, `aria-labelledby` / `aria-label`.
> - **Click outside** — optional dismiss on backdrop; don’t break focus trap.
>
> Mentioning only “absolute div + overlay” is a junior answer; focus + a11y is the mid-level bar.

### 24. Tabs — what a11y details matter?

> **Short:** Correct roles, keyboard support, and roving tabindex so only the active tab is in the tab order.
>
> **Details:**
> - Roles: `tablist`, `tab`, `tabpanel`; tie panels with `aria-controls` / `id`, tabs with `aria-labelledby`.
> - `aria-selected={true/false}` on tabs.
> - **Roving tabindex:** active tab `tabIndex={0}`, others `-1`; Arrow Left/Right (and Home/End) move selection and focus.
> - Panels: hide inactive content (`hidden` or conditional render) and keep the relationship clear for AT.
> - **Controlled mode** (`value` + `onChange`) when parent syncs URL or analytics; uncontrolled `defaultValue` for simple local UI.

### 25. Autocomplete / combobox mental model?

> **Short:** Focus stays on the **input**; the popup is a **listbox**; active option is exposed via `aria-activedescendant`, not by moving focus into each option.
>
> **Behavior:**
> - Open on type/focus (product-dependent); Arrow Up/Down move highlight; Enter selects; Escape closes / clears per UX.
> - Click outside closes.
> - On option `mousedown`, `preventDefault()` so the input doesn’t blur before `click` runs (classic “click does nothing” bug).
> - Wire `aria-expanded`, `aria-controls`, and option `id`s for the active descendant.
>
> This is the WAI-ARIA combobox pattern mid-level interviewers expect—not just a filtered `<ul>` under an input.

### 26. Why `IntersectionObserver` for infinite scroll?

> **Short:** It notifies when a sentinel enters the root’s viewport (optionally early via `rootMargin`), without manual scroll math or a global scroll listener on every tick.
>
> **Benefits:** Declarative; browser-optimized; easy to enable/disable; cleanup is `disconnect()`.
> **Options:** `root` = scrollable container if the list isn’t the window; `rootMargin: "200px"` prefetches; `threshold` for how much must be visible.
> **Practice:** `useIntersectionSentinel` keeps `onIntersect` in a ref so the observer effect doesn’t re-bind on every parent render, and respects `enabled` for the duplicate-fetch guard.

### 27. Portal — when do you need it?

> **Short:** When parent CSS (`overflow: hidden`, stacking context, `transform`, z-index) would clip or bury overlays—modals, popovers, toasts, tooltips.
>
> **`createPortal(child, document.body)`** (or a dedicated overlay root): DOM parent is `body`, but **React tree parent is unchanged**—context, props, and event bubbling in React’s sense still follow the component tree (native DOM bubbling follows the portal DOM placement—know that distinction if asked).
>
> **Don’t portal everything**—only UI that must escape layout constraints.

---

## F. Performance, Architecture & Trade-offs (28–30)

### 28. How do you approach React performance in an interview?

> **Short:** Measure first, then fix data-flow and list cost; don’t lead with blanket `useMemo`.
>
> **Order of attack:**
> 1. **Reproduce & measure** — React Profiler, slow interaction, what re-renders, how long commit takes.
> 2. **State placement** — too much state too high forces huge subtrees to update; colocate or split contexts.
> 3. **Context churn** — unstable `value={{ ... }}` re-renders all consumers; split or memoize the value carefully.
> 4. **Lists** — virtualize long feeds before micro-optimizing hooks; stable keys; avoid inline huge computations in render without need.
> 5. **Then** memoize hot children / heavy derives if profiling still shows waste.
>
> Saying “I’d wrap everything in `React.memo`” is a red flag; saying “Profiler → state → lists → memo” sounds senior-leaning mid-level.

### 29. What would you use React Query / SWR for?

> **Short:** Server-state cache: deduping identical requests, retries, background refetch, stale-while-revalidate, and `useInfiniteQuery` for cursor/page feeds.
>
> **They help with:** Cache keys, sharing data across components, avoiding manual `loading/error` boilerplate, window-focus refetch policies.
>
> **They don’t remove:** Product rules—reset the list when filters change, handle optimistic UI conflicts, and understand abort/outdated responses. You should still be able to explain race guards without the library.
>
> **Line:** “I’d use React Query for server cache and infinite queries; I’d still own UX states and filter-reset semantics in the feature.”

### 30. Virtual DOM / reconciliation — 30-second version?

> **Short:** React builds a new element tree describing UI, diffs it against the previous tree, and applies a minimal set of DOM updates. Matching is by component type + position/`key`.
>
> **A bit more:**
> - **Elements** are cheap descriptions (`type`, `props`); the **host tree** (DOM) is what users see.
> - Same type + same `key` → update that node’s props/children; different type → tear down and replace.
> - **Keys** tell list reconciliation which item moved vs which is new—linking back to question 4.
> - **State updates schedule work**; in concurrent React, rendering can be interrupted, but the mid-level takeaway is: you describe UI as a function of state, and reconciliation decides the DOM patch.
>
> You don’t need Fiber lane internals for mid-level—know the mental model and how keys/state fit in.

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
