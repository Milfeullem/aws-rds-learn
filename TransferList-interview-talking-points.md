# Transfer List — Interview Talking Points

Verbal scripts for explaining while coding. Speak decisions, not line-by-line narration.

Practice files: `my-app/src/components/TransferList/`  
Skeleton: `App.tsx` · Reference: `App.solution.tsx`

---

## Opening (1–2 min)

> I’ll build a dual-list transfer: Available on the left, Chosen on the right.
> Membership is two arrays. Selection is two `Set`s of ids—view state, not part of the item model.
> Middle controls move selected items or the whole side; buttons disable when there’s nothing to move. After a move I clear the source side’s checked set so we don’t keep stale ids.

> Data flow: `checkbox → toggle Set → Move → moveSelected/moveAll helpers → update both arrays + clear source Set → panels re-render`.

---

## While coding (decision points)

| You’re writing… | Say… |
|-----------------|------|
| Two arrays vs one map | Two arrays match the UI 1:1 and make “move” an obvious splice across sides. A single `Record<id, side>` is nicer for O(1) lookup / large catalogs—I’d mention it as a scale follow-up. |
| Selection in a `Set` | Add/delete is clear; I clone `new Set(prev)` (or via helper) so the reference changes and React re-renders. Don’t put `checked` on the item—selection isn’t domain data. |
| Separate left/right Sets | An item only lives on one side. Keeping two Sets avoids “checked but not visible” bugs when you move without clearing. |
| Clear checked after move | Moved ids leave the source list. If I don’t clear, the Set still holds orphans—Select-all math and “selected count” go wrong. |
| Preserve relative order | I walk the source once: remaining stay in place; movers append to target in the same relative order. Interviewers care that you don’t scramble the list. |
| Disable, don’t no-op only | `disabled={!canMove}` is UX + a11y. I still guard in the helper for empty Sets, but the button state is what the user sees. |
| Select all = ids in *current* list | `setAllChecked(items, true)` only checks what’s on that panel. If a filter existed later, “all” would mean “all visible”. |
| Controlled checkboxes | `checked={set.has(id)}` + `onChange`—not `defaultChecked`. Same pattern as TodoList. |
| Keys | Stable `item.id`—never the index when items hop sides. |
| Helpers outside the component | `moveSelected` / `moveAll` are pure. Easy to unit-test and keeps App as wiring. |

---

## Mental model (if they ask)

> **Membership ≠ selection.**
> Membership: which array holds the item (business / form value).
> Selection: which ids are checked for the *next* transfer action (ephemeral UI).
> Same idea as Nested Comments: don’t stuff collapse/reply into the tree nodes.
>
> Controlled Transfer List (form field): parent would own `value={rightIds}` / `onChange`; internal checked Sets stay uncontrolled local UI unless you need to restore them.

---

## Accessibility (say while wiring a11y)

> Each panel is a labeled `<section>`; lists are real `<ul>` / `<li>`; every checkbox has a visible `<label>`.
> Control buttons show `>` / `>>` visually but include `sr-only` text (“Move selected to right”) so the accessible name isn’t just a glyph.
> `disabled` on empty actions; selected count in `aria-live="polite"` so AT hears changes after a transfer.
> Follow-up: after Move, move focus to the destination list or the next enabled control so keyboard users aren’t stranded on a now-disabled button.

---

## Trade-offs / follow-ups (pick 2–3)

> Per-panel search/filter: keep full arrays as source of truth; derive `visible = filter(items, query)`. Select-all and move-selected should decide: visible-only vs all-matched—say which and stick to it.

> Dual-click / double-click to transfer one item: nice progressive enhancement; still go through the same helper so order rules stay consistent.

> Drag-and-drop between lists: same membership model; DnD is another input path into `moveSelected`.

> Normalize to `Map<id, item>` + `leftIds[]` / `rightIds[]` when labels are heavy or shared with a server catalog—arrays of ids only in UI state.

> Undo stack: push `{ left, right }` snapshots (or inverse ops) before each move—interview-friendly if they ask about reversibility.

> Controlled + form submit: expose Chosen ids as the field value; validate “at least one” before submit.

---

## Wrap-up (~30s)

> What works today: dual lists, per-item + select-all, move selected / move all, disabled guards, clear source selection, order-preserving helpers.
> Structure: pure transfer utils; panels presentational; App owns membership + selection.
> Known gaps: filter, DnD, focus restore after move, controlled `value` API.
> If we have time, I’d add per-panel filter next and define “select all” as visible-only.

---

## Accessibility one-liner

> Labeled panels and checkboxes, named transfer buttons (not glyph-only), disabled empty actions, polite live selected counts; recover focus after move if time allows.

---

## Cheat-sheet: moveSelected

```
moveSelected(source, target, checked):
  if checked empty: return same refs
  moving = []; remaining = []
  for item in source:
    (checked.has(item.id) ? moving : remaining).push(item)
  return {
    source: remaining,
    target: [...target, ...moving],  // preserve mover order
    checked: new Set()               // clear source selection
  }

canMoveRight    = leftChecked.size > 0
canMoveAllRight = left.length > 0
```

---

## Demo script (2 min after coding)

1. Check 2–3 on Available → `>` → they append on Chosen; left selected count resets.
2. Select all on Chosen → `<<` → everything returns left; buttons disable appropriately.
3. `>>` with items on left → all move; Available empty state.
4. Toggle one checkbox off after Select all → “selected” count updates; `>` only moves remaining checked.
