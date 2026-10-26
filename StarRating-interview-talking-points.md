# StarRating — Interview Talking Points

Verbal scripts for explaining while coding. Speak decisions, not line-by-line narration.

---

## Opening (1–2 min)

> I’ll build an interactive star rating: click to set a value, hover to preview, click the same star again to clear.
> Two pieces of local state: committed rating and hover preview. Display prefers hover when the pointer is over the list.

> Data model: 0-based index into `max` stars; `-1` means “not rated”. The visible rating is `index + 1`.

---

## While coding (decision points)

| You’re writing… | Say… |
|-----------------|------|
| `max` prop | Configurable upper bound with a default of 5. Keeps the component reusable without hardcoding length. |
| Two state values | `selectedStar` is committed; `hoverStar` is ephemeral preview. Separating them avoids mixing “what the user chose” with “what they’re pointing at”. |
| Sentinel `-1` | Unrated is `-1`, not `0`. Index `0` is a valid one-star rating—don’t reuse it as empty. |
| Fill rule `i <= value` | Stars from `0..value` light up. Classic “fill up to N” rating UI. |
| Guard with `>= 0` | Always check `selectedStar >= 0` / `hoverStar >= 0` before filling. Using `> 0` silently breaks the first star. |
| Hover wins over selected | Class: hover if previewing, else selected. Users expect preview to override the committed look while moving. |
| Toggle clear on re-click | Same index again → back to `-1`. Cheap UX for “clear rating” without an extra control. |
| Functional `setSelectedStar` | Updater form so toggle compares against the latest value, not a stale closure. |
| Leave on the list, enter on stars | `onMouseEnter` per star; `onMouseLeave` on the parent list. Moving between siblings doesn’t clear hover, so no flicker and no `setTimeout` hack. |
| `Array.from({ length: max })` | Simple fixed-length map. Keys are indices—stable for a static star count. |
| `<button>` per star | Native click + keyboard (Enter/Space). Don’t use clickable `<div>`s. |

---

## Hover vs leave (if they ask)

> **Leave on the container, not each star.**
> Per-star `mouseleave` fires when moving to the next star and briefly clears preview (flicker). Parent leave only fires when the pointer exits the whole group.
> The old `setTimeout(0)` + cancel-on-enter pattern works but is harder to explain; container leave is the cleaner story.

---

## Accessibility (say while wiring a11y)

> Group the stars with `role="group"` and `aria-label="Rating"` so ATTs get a named control set. Avoid `role="optgroup"`—that’s for `<select>`, not custom widgets.
> Each star is a toggle button: `aria-label` like “Rate N out of M”, plus `aria-pressed` on the currently selected index.
> Status text lives in `<output>` with a stable `useId`, linked via `aria-describedby`, so the current rating (or “Not rated”) is associated with the control.
> Buttons already support keyboard; if I go deeper I’d discuss a radiogroup + arrow-key pattern as an alternative APG model.

---

## Trade-offs / follow-ups (pick 2–3)

> Uncontrolled only today. Production often needs `value` / `defaultValue` / `onChange` for forms.

> Half-star or fractional ratings would change the model (e.g. store a number `1..max` with step `0.5`) and the hit-testing.

> Read-only / disabled display mode for showing someone else’s rating without hover/click.

> Controlled vs uncontrolled: lift state when a parent form owns the score; keep local state for demos and isolated widgets.

> Visual: CSS for `.hover` / `.selected`, or an SVG star icon instead of `*`.

> TypeScript: type `max`, handlers, and optionally a `StarRatingProps` with `onChange?: (value: number \| null) => void`.

---

## Wrap-up (~30s)

> What works today: click to rate, hover preview, clear on re-click, unrated sentinel, fill-up-to-N rendering, basic group + button a11y with live status text.
> Structure: one component, two local states, leave handler on the list.
> Known gaps: no controlled API, no styles/icons, radiogroup keyboard pattern optional.
> If we have time, I’d add `value` / `onChange` and tighten the a11y role to match the APG pattern we prefer.

---

## Accessibility one-liner

> Named `role="group"`, one keyboard-focusable button per star with descriptive `aria-label` and `aria-pressed`, plus `<output>` + `aria-describedby` for the current rating. Call out: not `optgroup`; optional upgrade to radiogroup + arrows.

---

## When stuck

> I’ll get select + fill rendering correct first—especially the `>= 0` first-star case—then hover preview with leave on the parent, then a11y labels and status text.

> Happy to talk through why hover is separate state even if we don’t add a controlled API yet.

---

## Accessibility checklist (interview priority)

### Already good to mention

- `role="group"` + `aria-label="Rating"` on the star list
- `aria-describedby` → status `<output>`
- Per-star `aria-label` (`Rate N out of M`)
- `aria-pressed` on the selected star
- Native `<button>` for pointer + keyboard
- `useId` for stable status id
- “Not rated” when value is `-1`

### Still worth adding / calling out

1. **Role** — Use `group` (or radiogroup), never `optgroup`.
2. **Pluralization** — Prefer `star` / `stars` over a literal `star(s)` in the label.
3. **Radiogroup variant** — `role="radiogroup"` + `role="radio"` + arrow keys if the interviewer wants APG fidelity.
4. **Focus / disabled** — Read-only mode should remove interactive buttons or use `aria-hidden` decorative stars + text rating.
5. **Form integration** — Hidden input or `onChange` so the value can submit with a form.

---

## Common interviewer prompts → short answers

| Prompt | Answer |
|--------|--------|
| Why two pieces of state? | Committed vs preview. Mixing them makes leave/clear logic messy. |
| Why `-1` not `0` for empty? | `0` is a valid first star; empty needs a distinct sentinel. |
| Why `>= 0` not `> 0`? | Index `0` must light up; `> 0` hides one-star selection/hover. |
| Why leave on the parent? | Avoid flicker between adjacent stars; no timeout needed. |
| Why buttons? | Free keyboard support and a proper accessible name. |
| Controlled component? | Add `value` + `onChange`; keep hover local either way. |
| How do you test this? | Click star → assert fill + status; re-click → Not rated; hover → preview class; leave list → preview clears. |
| Production next steps? | Controlled API, styles/icons, optional half-stars, typed props. |
