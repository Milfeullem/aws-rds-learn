# Autocomplete — Interview Talking Points

Verbal scripts for explaining while coding. Speak decisions, not line-by-line narration.

---

## Opening (1–2 min)

> I’ll build a controlled combobox: one input, a filtered suggestion list, and keyboard/mouse selection.
> UI state stays inside the component—query, open/closed, and active index. The parent only owns the option list and an optional `onSelect` callback.

> Pattern: WAI-ARIA **combobox + listbox**. Focus stays on the input; the active option is exposed with `aria-activedescendant`, not by moving DOM focus into the list.

---

## While coding (decision points)

| You’re writing… | Say… |
|-----------------|------|
| Component boundary | Options and `onSelect` come from the parent. Filtering, open state, and highlight index are local—no sibling needs them. |
| Three pieces of state | `inputValue` (query), `isOpen` (popup), `focusedIndex` (active option). Keep them separate so keyboard and mouse can update highlight independently of the typed string. |
| Derived `filteredOptions` | Filter on each render from `options` + `inputValue`. No need to store the filtered array unless we debounce or fetch remotely. |
| Filter on change (not stale state) | When the user types, I compute matches from the **new** value before deciding `isOpen` / index. Using the old derived list would open/close one keystroke late. |
| Open when query is non-empty | Open even if there are zero matches so we can show an empty state. Closing only when there are matches would hide “No options found”. |
| Default first option on type | After a query change with matches, set `focusedIndex` to `0` so Enter works immediately without an extra ArrowDown. |
| Click outside | `mousedown` on `document` + container ref. Close and clear the active index. Cleanup the listener on unmount. |
| `onMouseDown` preventDefault on options | Prevents the input from blurring before `click`, which would otherwise close the list and swallow the selection. |
| Keyboard model | ArrowUp/Down cycle; Home/End jump; Enter selects; Escape closes and keeps focus on the input; Tab closes and lets focus leave. ArrowDown while closed reopens if there’s a query. |
| `scrollIntoView` | When the active index changes, scroll that option into view with `block: "nearest"` so long lists stay usable with the keyboard. |
| Highlight match text | Split with a case-insensitive regex; wrap matches in `<mark>`. Escape the query first so `.` `*` `(` don’t break the regex. |
| `autoComplete="off"` | Turns off the browser’s native suggestions so they don’t fight our listbox. |
| Stable ids (`useId`) | Build `listbox` / `option` / `status` ids from one base id so `aria-controls` and `aria-activedescendant` point at real nodes. |

---

## Combobox mental model (if they ask)

> **Focus stays on the input.** Moving focus into each `<li>` is a different pattern (more like a menu). For autocomplete, the APG combobox keeps typing in the field and points at the active option with `aria-activedescendant`.
> The list is `role="listbox"`; each item is `role="option"` with `aria-selected`.
> `aria-expanded` mirrors open/closed; `aria-controls` points at the listbox when open.

---

## Accessibility (say while wiring a11y)

> Visible `label` + `htmlFor` when provided; otherwise `aria-label` from the placeholder so the field always has a name. Placeholder alone is not enough.
> Combobox wiring: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, `aria-activedescendant` on the active option id.
> Options expose `aria-selected` for the highlighted row—not just a CSS `.focused` class.
> A visually hidden `aria-live="polite"` status announces result count or “No options found” when the popup is open.
> After select, I put focus back on the input so the user can keep typing or tab away cleanly.

---

## Trade-offs / follow-ups (pick 2–3)

> Filtering is client-side and sync. For an API I’d debounce the query, track a request id / AbortController, and ignore stale responses.

> No virtualization yet; fine for a short static list. Large result sets would need a windowed listbox and careful `aria-activedescendant` ids.

> Matching is simple substring / case-insensitive. Production might add ranking, fuzzy match, or “starts with” first.

> Options are plain strings. Richer data would use `{ id, label }` with `id` for keys and selection value.

> I didn’t implement typeahead-into-value or multi-select; those are different combobox variants in the APG.

> Async empty vs loading: I’d add a distinct “Loading…” state and keep the live region updated so screen readers aren’t stuck on “No options found”.

---

## Wrap-up (~30s)

> What works today: filter-as-you-type, open/close, mouse select, full keyboard nav, empty state, match highlighting, and combobox a11y with live status.
> Structure: parent supplies options and selection callback; the component owns query, popup, and active index.
> Known gaps: no debounce/remote fetch, no virtualization, string-only options.
> If we have time, I’d add debounced async search with race-condition handling next.

---

## Accessibility one-liner

> Combobox on the input with label (or `aria-label`), `aria-expanded` / `aria-controls` / `aria-activedescendant`, listbox options with `aria-selected`, `autoComplete="off"`, and a polite live region for result count / empty. Focus never leaves the input during arrow navigation; selection restores focus to the input.

---

## When stuck

> I’ll get filter + click select + basic open/close working first, then keyboard, then ARIA.
> Happy to talk through why focus stays on the input and how `aria-activedescendant` replaces moving focus into the list.

---

## Accessibility checklist (interview priority)

### Already good to mention

- `label` + `htmlFor` (or fallback `aria-label`)
- `role="combobox"` + `aria-autocomplete="list"`
- `aria-expanded` / `aria-controls` / `aria-activedescendant`
- `role="listbox"` / `role="option"` / `aria-selected`
- `autoComplete="off"`
- Polite live status for count / no results
- Escape / Tab close; Enter selects active option
- `onMouseDown` preventDefault on options so click select works

### Still worth adding / calling out

1. **Debounced async** — Abort in-flight requests; don’t announce stale empty states.
2. **Loading state** — Separate from “no results” for both UI and live region.
3. **Option objects** — Stable `id` keys instead of `option-index` when labels can duplicate.
4. **Disabled options** — `aria-disabled` and skip in keyboard traversal.
5. **Portal + focus trap notes** — If the list renders in a portal, outside-click and `aria-controls` ids still need to line up; focus should remain on the input.

---

## Common interviewer prompts → short answers

| Prompt | Answer |
|--------|--------|
| Why not move focus into the list? | Combobox pattern: keep typing in the input; announce the active option via `aria-activedescendant`. |
| Why recompute filter on the new value? | Derived state from the previous render is stale inside `onChange`; open/index would lag by one keystroke. |
| Why open with zero matches? | So empty state is reachable; otherwise “No options found” never shows. |
| Why `mousedown` preventDefault on options? | Stops input blur from closing the popup before `click` fires. |
| Why escape the highlight regex? | User input can include regex metacharacters; unescaped patterns throw or match wrong. |
| Controlled vs uncontrolled input? | Controlled—selection and typing must share one source of truth for the value. |
| How do you test this? | Type → assert filtered options; Arrow/Enter → assert value + `onSelect`; Escape → assert closed; no matches → assert empty copy; check key ARIA attrs. |
| Production next steps? | Debounce + async + abort, richer option model, virtualization, loading/error states. |
