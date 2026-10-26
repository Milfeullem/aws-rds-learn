# Nested Comments — Interview Talking Points

Verbal scripts for explaining while coding. Speak decisions, not line-by-line narration.

Practice files: `my-app/src/components/NestedComments/`  
Skeleton: `App.tsx` · Reference: `App.solution.tsx`

---

## Opening (1–2 min)

> I’ll model comments as a tree: each node has `id`, `author`, `body`, and `children[]`.
> The parent owns the tree plus two bits of UI state: which node is being replied to, and which threads are collapsed.
> Rendering is recursive—one `CommentNode` maps its children to more `CommentNode`s. Mutations stay immutable helper functions so the recursion doesn’t mutate in place.

> Data flow: `CommentForm → onCreate / onReply → appendComment(tree) → CommentList → CommentNode (recursive)`.

---

## While coding (decision points)

| You’re writing… | Say… |
|-----------------|------|
| Nested tree vs flat map | Nested `children` matches the UI and is fine for a machine-coding demo. Flat `{ id → node, parentId }` is better for O(1) lookup and moving nodes—I’d mention it as a follow-up. |
| Three state buckets | `comments` = data. `replyTargetId` = which inline form is open. `collapsedIds` = UI chrome. Don’t stuff collapse/reply into the comment objects. |
| Single `replyTargetId` | Only one reply form at a time. Opening Reply on B closes A’s form by replacing the id. Simpler than a Set of open forms. |
| `Set` for collapsed | Add/delete is clear; on toggle I clone `new Set(prev)` so the reference changes and React re-renders. |
| Recursive component | Same component at every depth. Pass `depth` for indent / max-depth UX if needed; keep handlers from the parent so nodes stay mostly presentational. |
| Immutable `appendComment` | Walk with `map`. On match, `{ ...node, children: [...node.children, next] }`. Unrelated branches return the same reference when possible. |
| Delete = subtree | Filter out the id at every level; children go with the parent. Say that out loud so they know orphans aren’t left behind. |
| Reply then uncollapse | If the parent was collapsed, remove it from `collapsedIds` after a successful reply so the new child is visible. |
| Draft state in the form | Author/body drafts live inside `CommentForm`. Submitting lifts a trimmed `{ author, body }`—same colocation idea as Todo create. |
| Ids | `Date.now()` + short random suffix for the demo. Production: UUID or server ids. |
| Ordered list | `<ol>` for threads—comments have sequence. Nested `<ol>` under each parent. |

---

## Mental model (if they ask)

> **Tree for render, flat for edits at scale.**
> Interview default: nested array + recursive render.
> When updates get heavy (edit body, move thread, lazy-load replies), normalize to `Record<id, Comment>` + `rootIds`, derive children by `parentId`, and memoize nodes.
> Collapse/reply are *view state*—if you persist them into each comment you’ll fight controlled updates and SSR/hydration later.

---

## Accessibility (say while wiring a11y)

> Visible labels on the composer fields; Reply form gets `autoFocus` when opened.
> Collapse control uses `aria-expanded`. Delete/Reply buttons are real `<button>`s, not clickable divs.
> Comment count (or empty state) can sit in `aria-live="polite"`.
> Nested lists: keep semantic `<ol>` / `<li>`; indentation is CSS (`border-left` + margin), not extra spacer nodes that confuse the accessibility tree.
> Follow-up: after Delete, move focus to the parent thread or the root composer so focus isn’t lost to `body`.

---

## Trade-offs / follow-ups (pick 2–3)

> Max depth: after N levels, disable Reply or flatten further replies (“continue this thread”)—avoids runaway indent on mobile.

> Edit / upvote would need another immutable mapper (`updateComment(tree, id, patch)`), same walk as append.

> Soft-delete vs hard-delete: soft-delete keeps “comment removed” placeholders so thread structure remains; hard-delete is what we did.

> Lazy-load replies: store `children: []` + `replyCount` and fetch on expand—collapse state then doubles as a load trigger.

> Optimistic UI + server ids: temp client id, replace on response; careful if the user replies to a temp node before the server returns.

> Performance: deep trees re-render from the root on any update. Flat store + memoized `CommentNode` (compare by id + child ids) scales better.

---

## Wrap-up (~30s)

> What works today: nested render, root post, single-target reply, immutable insert/delete, collapse Set, form-local drafts.
> Structure: helpers own tree surgery; App owns state; nodes stay recursive and presentational.
> Known gaps: edit, depth cap, flat normalization, focus restore after delete.
> If we have time, I’d add edit-in-place and a max-depth guard next.

---

## Accessibility one-liner

> Labeled forms, semantic nested lists, `aria-expanded` on collapse, live region for counts/empty; recover focus after delete if time allows.

---

## Cheat-sheet: tree helpers

```
appendComment(tree, parentId, next):
  if parentId == null: return [...tree, next]
  return tree.map(node =>
    node.id == parentId
      ? { ...node, children: [...node.children, next] }
      : { ...node, children: appendComment(node.children, parentId, next) }
  )

removeComment(tree, id):
  return tree
    .filter(node => node.id != id)
    .map(node => ({ ...node, children: removeComment(node.children, id) }))
```

---

## Demo script (2 min after coding)

1. Post a root comment → count bumps.
2. Reply on a nested node → form opens only there; Cancel closes it.
3. Hide replies → `aria-expanded` false; reply again → thread re-opens so the new child shows.
4. Delete a parent → whole subtree gone; reply target cleared if it was that id.
