# TodoList — Interview Talking Points

Verbal scripts for explaining while coding. Speak decisions, not line-by-line narration.

---

## Opening (1–2 min)

> I’ll split this into three pieces: a create form with local draft state, a list renderer, and a parent that owns the todo array.
> Shared business state lives in the parent; ephemeral UI state stays in the child that uses it.

> Data flow: `CreateItem → onCreate(name) → TodoList updates list → ItemList renders`.

---

## While coding (decision points)

| You’re writing… | Say… |
|-----------------|------|
| Component split | Parent owns the list. CreateItem only creates; ItemList only displays and emits toggle/remove. Keeps responsibilities clear under time pressure. |
| `list` in TodoList | This is shared business state—create, toggle, and remove all need it—so it belongs at the root of this feature. |
| Input state in CreateItem | The draft string is only used by the input. No sibling needs it, so I keep it local. Lifting would make every keystroke re-render the list for no benefit. |
| Functional `setList` | I use the updater form so each mutation is based on the previous list and stays safe if updates batch. |
| Immutable updates | Push via copy (`[...pre]`), toggle via `map` + spread item, remove via `filter`. Never mutate the existing array or item in place. |
| Item shape `{ id, name, done }` | Minimal model for the prompt. `id` is for keys and targeting updates; `done` drives checkbox and strikethrough. |
| `Date.now()` as id | Fine for a machine-coding demo. If asked about collisions: counter, `crypto.randomUUID()`, or a library id. |
| `useId` for input | Stable id for `label htmlFor` without hardcoding, safe if multiple instances mount. |
| Checkbox `onChange` | Controlled checkbox: `checked={done}` + `onChange` to toggle—not `onClick`. |
| Clear input after create | After a successful create I reset local input so the next item starts empty. |
| Empty trim guard | Reject whitespace-only names before calling `onCreate`. |

---

## State colocation (if they ask)

> **Lift the list, not the input.**
> The list is read and written by multiple children → parent.
> The input draft is write-local and only becomes “data” on submit → stay in CreateItem.
> I’d lift the input only if the parent must prefill, validate across siblings, or persist the draft.

---

## Accessibility (say while wiring a11y)

> Label + `htmlFor` on the create field. List has an accessible name. Checkbox and remove buttons include the item name so each control is distinguishable.
> After delete, focus can fall to `body`—I move focus back to the list container as a simple recovery.
> Empty state uses `aria-live="polite"` so the prompt can be announced when the list becomes empty.
> If I have time: wrap create in a `<form>` so Enter is native submit; drop redundant `aria-label` on a button that already says “Create”; add a section heading for landmarks.

---

## Trade-offs / follow-ups (pick 2–3)

> Ids from `Date.now()` can collide under rapid creates—I’d switch to an incrementing counter or UUID.

> No persistence yet; `localStorage` or a small API layer would be the next step.

> Filtering / “show completed only” would stay derived in the parent (`useMemo`) so ItemList stays presentational.

> For large lists I’d virtualize; this size doesn’t need it.

> Controlled vs uncontrolled create field: uncontrolled draft is enough; controlled only if the parent owns validation UX.

> Full keyboard polish: form submit, and after remove focus the next/previous item instead of the whole list.

---

## Wrap-up (~30s)

> What works today: create with validation and clear, toggle complete, remove, empty state, basic a11y labels and post-delete focus recovery.
> Structure: parent owns list; CreateItem owns draft; ItemList is mostly presentational.
> Known gaps: form semantics for create, stronger focus restore to a sibling item, typed model if we want stricter TS.
> If we have time, I’d convert create to a form and tighten the remove focus path.

---

## Accessibility one-liner

> Semantically: labeled create input, named list, checkboxes and remove actions that include the todo name, `onChange` on controlled checkboxes, polite live empty state, and focus returned to the list after delete. Gaps I’d call out: prefer `<form onSubmit>`, avoid overriding visible button text with a generic `aria-label`, and refine focus to the adjacent item rather than the list root.

---

## When stuck

> I’ll get create / toggle / remove working first with clear state ownership; a11y polish and edge cases next.

> Happy to talk through why the draft input stays local even if we don’t refactor further now.

---

## Accessibility checklist (interview priority)

### Already good to mention

- `<label htmlFor>` + `useId` on the create input
- `ul` with `aria-label="todo list"`
- Checkbox `aria-label` includes item name + next action (`done` / `undone`)
- Remove `aria-label` includes item name (`Remove ${name}`)
- Controlled checkbox uses `onChange`
- Empty state `aria-live="polite"`
- After remove, focus moves to the list (`listRef`)

### Still worth adding / calling out

1. **Form** — Wrap create in `<form onSubmit>`; use `type="submit"`; drop manual Enter handler.
2. **Button names** — If the button text is “Create”, skip a redundant `aria-label` (it overrides the visible name).
3. **Heading** — Give the section a visible heading or `aria-labelledby` for landmarks.
4. **Focus after delete** — Prefer focusing the next/previous item (or the create input if the list is empty), not only the list container (`tabIndex={-1}` on the list if you keep list-level focus).
5. **Don’t aria-label the `<li>`** — It can mask child control names; let checkbox/button names carry the meaning.

---

## Common interviewer prompts → short answers

| Prompt | Answer |
|--------|--------|
| Why not put input in the parent? | Draft is local UI state; parent only needs the committed name. |
| Why functional updates? | Always derive from latest state; safer with batched/async updates. |
| Why not mutate `list`? | React relies on new references; mutating hides changes and causes subtle bugs. |
| Checkbox click vs change? | Controlled inputs should use `onChange` with `checked`. |
| How do you test this? | Create → assert item; toggle → assert checked/class; remove → assert gone; empty → assert empty copy. |
| Production next steps? | Stable ids, persistence, optional filter, form a11y, typed `TodoItem`. |
