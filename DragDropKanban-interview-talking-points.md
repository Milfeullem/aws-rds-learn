# Drag & Drop Kanban — Interview Talking Points

Verbal scripts for explaining while coding. Speak decisions, not line-by-line narration.

Practice files: `my-app/src/components/DragDropKanban/`  
Skeleton: `App.tsx` · Reference: `App.solution.tsx`

---

## Opening (1–2 min)

> I’ll build a three-column Kanban with HTML5 drag and drop—no library.
> Board data is `columns[]`, each with nested `cards[]`. Drag chrome is separate: which card is dragging, and the current drop target `{ columnId, index }`.
> On drop I call a pure `moveCard` helper that removes from the source column and inserts at the target index—same-column reorder and cross-column move share one path.

> Data flow: `dragStart → set drag → dragOver (preventDefault + dropTarget) → drop → moveCard → clear drag UI`.

---

## While coding (decision points)

| You’re writing… | Say… |
|-----------------|------|
| Nested cards vs normalized | Nested `column.cards` matches the UI and is enough for a machine-coding demo. Normalized `cardsById` + `column.cardIds[]` scales better for lookups / shared card detail drawers—I’d mention it as a follow-up. |
| Three state buckets | `columns` = domain. `drag` = active payload. `dropTarget` = hover preview. Don’t put `isDragging` on the card model. |
| `preventDefault` on `dragOver` | Without it the browser won’t fire `drop`. That’s the #1 HTML5 DnD gotcha—say it out loud when you wire the column. |
| `setData` on `dragStart` | Firefox requires data in `dataTransfer`. I also keep `cardId` / `fromColumnId` in React state so drop doesn’t depend on parsing the transfer payload. |
| Clear on `dragEnd` | Drop may never fire (Esc / cancel / leave window). `dragEnd` always clears drag + indicator so the UI can’t stick in a ghost state. |
| Same helper for reorder + move | `moveCard(cols, id, from, to, index)`: remove first, then clamp insert index on the destination (after removal for same-column). One mental model, fewer bugs. |
| Skip redundant `setDropTarget` | `dragOver` fires continuously. If column+index unchanged, return the previous object—avoids useless re-renders while dragging. |
| Drop indicator | Pure UI derived from `dropTarget`. Not persisted. Shows insert-before index (and end-of-list). |
| Keys | Stable `card.id`—never index. Cards hop columns; index keys would remount / lose identity. |
| Helpers outside App | `moveCard` is pure and testable. App only wires events → state. |

---

## Mental model (if they ask)

> **Board ≠ drag session.**
> Board: which column owns which ordered cards (what you’d sync to a server).
> Drag session: ephemeral pointer UX—active id + preview index. Ends on drop or dragEnd.
>
> Same idea as Transfer List: membership arrays are data; selection/drag Sets/objects are view state.
>
> Controlled board later: parent owns `columns` / `onColumnsChange`; drag state stays local unless you need cross-window DnD.

---

## Accessibility (say while wiring a11y)

> Native HTML5 DnD is mouse-first and weak for keyboard / AT—I’ll say that honestly.
> Columns are labeled sections; card count uses `aria-live="polite"` so moves are announced.
> Follow-up (strong signal): keyboard alternative—focus a card, Space to pick up, ↑↓ / ←→ to choose slot/column, Space/Enter to drop, Esc to cancel. Or a “Move to…” menu per card.
> Libraries (dnd-kit, pragmatic-dnd) exist largely because of a11y + touch + consistent sensors—not because `draggable` can’t move a div.

---

## Trade-offs / follow-ups (pick 2–3)

> Touch / mobile: HTML5 DnD is spotty; pointer-event sensors or a library.

> Optimistic server sync: `moveCard` locally → PATCH; on failure roll back to previous `columns` snapshot. Capture snapshot *before* the optimistic update.

> Same-index no-op: helper returns the same array reference so React skips work—nice to mention if they look at the util.

> Insert index after removal: hover index is “before cards[i]” on the *pre-removal* list. Same-column + moving down → use `toIndex - 1` after remove, then clamp.

> Persist order: store `cardIds[]` per column on the server; client can keep nested cards for render or normalize.

> Auto-scroll while dragging near column edges—common production polish, skip unless asked.

> Multi-select drag: selection Set + move many—same membership idea as Transfer List.

---

## Wrap-up (~30s)

> What works today: three columns, HTML5 DnD, cross-column move + same-column reorder, drop indicator, drag UI cleared on end, immutable `moveCard`.
> Structure: presentational Board / Column / Card; pure board util; App owns columns + drag session.
> Known gaps: keyboard move path, touch, persistence / conflict handling, normalized card store.
> If we have time, I’d add a keyboard “Move to column” menu so it’s not mouse-only.

---

## Accessibility one-liner

> Labeled columns and live counts for sighted+AT feedback; admit HTML5 DnD isn’t keyboard-accessible and offer a menu or dnd-kit-style keyboard sensor as the real fix.

---

## Cheat-sheet: HTML5 + moveCard

```
dragStart(card):
  dataTransfer.setData('text/plain', id)  // Firefox
  drag = { cardId, fromColumnId }

dragOver(column, index):
  event.preventDefault()                 // REQUIRED for drop
  dropTarget = { columnId, index }       // skip if unchanged

drop(column, index):
  columns = moveCard(columns, cardId, from, to, index)
  clear drag + dropTarget

dragEnd:
  clear drag + dropTarget                // even if drop skipped

moveCard(columns, id, from, to, index):
  remove card from `from`
  if same column && fromIndex < toIndex: toIndex -= 1
  clamp index to destination length
  insert card at index
  map columns immutably
```

---

## Demo script (2 min after coding)

1. Drag a To Do card into Doing → lands at end (or on indicator).
2. Reorder within Doing (drag above another card) → indicator + new order.
3. Drag to empty Done (or clear a column first) → empty-state drop zone works.
4. Start a drag then press Esc / drop outside → indicator and opacity clear via `dragEnd`.
