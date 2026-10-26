# SearchFileExplorer — Interview Talking Points

Verbal scripts for explaining while coding. Speak decisions, not line-by-line narration.

---

## Opening (1–2 min)

> I’ll split this into three parts: a controlled search input with debounce, a filtered tree, and selection/expand state.
> Filtering lives in the parent; the tree only renders. If a node matches, I keep the whole subtree; otherwise I keep the parent only when it has matching children.

> Data flow: `query → debounce → filter → FileTree`.

---

## While coding (decision points)

| You’re writing… | Say… |
|-----------------|------|
| Three pieces of state | I’m keeping `selected`, `expanded` as a `Set`, and `query` separate so we don’t dump everything into one object. |
| Debounce | Debouncing avoids re-filtering the whole tree on every keystroke. Highlight and filter both use the debounced value so they stay in sync. |
| Recursive `filterFile` | If the current node matches, return it as-is (including children). Otherwise filter children; keep the parent only if any child matched. |
| `Set` for expanded | Add/remove is O(1). On update I clone with `new Set` so the reference changes and React re-renders. |
| `useMemo(filtered)` | Memoize on `delayQuery` and `files`. |
| Force-expand while searching | UX: otherwise deep matches stay hidden. This is a search-mode override—I’m not necessarily persisting it into the user’s expand `Set` (or: I am / I’m not—pick one and say it). |
| Highlight + `escapeRegExp` | Escape regex special characters like `(`. Skip the regex entirely when the query is empty. |
| A11y | Label on the input, tree roles, and ideally a live region for results. Keyboard navigation is a follow-up if we run out of time. |

---

## Trade-offs / follow-ups (pick 2–3)

> For a large tree, debounce and memo aren’t enough—I’d flatten visible nodes and virtualize the list.

> Right now state is internal; for a real API I’d support controlled `expandedIds` / `onSelect`.

> Full ARIA tree keyboard support (roving tabindex + arrows) is the next a11y pass.

> Matching is substring today; we could add fuzzy or path-based search later.

> I’m using shallow immutable updates (`{ ...node, children }`)—enough here; I won’t mutate in place.

---

## Wrap-up (~30s)

> What works today: search, filter, highlight, expand, and select.
> Known gaps: tree keyboard / roving tabindex, `aria-live` for result changes, virtualization for large lists.
> If we have time, I’d add Enter and arrow keys next.

---

## Accessibility one-liner

> Semantically I’m using `tree` / `treeitem` with `aria-expanded`. The search field has a label, and clear restores focus. The gap is every item has `tabIndex={0}` and keydown is still a stub—the proper pattern is roving tabindex plus arrow keys. I’d announce filter changes with `aria-live`. Decorative icons get `aria-hidden` so they don’t steal the accessible name.

---

## When stuck

> I’ll get filter and render working first; keyboard navigation is next.

> Happy to talk through the ARIA tree pattern even if we don’t fully implement it now.

---

## Accessibility checklist (interview priority)

### Already good to mention

- `<label htmlFor>` + `useId` on the search input
- Clear button has `aria-label`; focus returns to the input after clear
- `role="tree" / treeitem / group"`, `aria-selected`, `aria-level`, `aria-expanded`
- Expand control has its own `aria-label` and `stopPropagation`

### Still worth adding / calling out

1. **Keyboard** — Prefer roving `tabIndex` (only the focused item is `0`). Minimum keys: Enter/Space, ↑/↓; Left/Right for collapse/expand if time allows.
2. **Live region** — Announce result count after debounce (`aria-live="polite"`).
3. **Highlight** — Don’t rely on color alone; keep the full name in the DOM for screen readers.
4. **Decorative icons** — `aria-hidden="true"` on `*` / `·`; don’t let icon labels steal the node name.
5. **Tree name** — e.g. `aria-label="File explorer"` on the root tree.
6. **Focus model** — Nested focusables (treeitem + inner button) conflict with Tab order; either pure ARIA tree (arrows only) or simplify and say so out loud.

---

## What not to say

- Don’t narrate every `const x = ...`
- Don’t apologize (“I’ll just hack something quickly”)
- Prefer: “Filter and render first; keyboard next” over silence or random refactors
