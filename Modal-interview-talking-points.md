# Modal — Interview Talking Points

Verbal scripts for explaining while coding. Speak decisions, not line-by-line narration.

---

## Opening (1–2 min)

> I’ll build a controlled modal: parent owns `isOpen`, Modal syncs that to the native `<dialog>` API.
> Why `<dialog>`: `showModal()` gives me backdrop, Escape, focus trap, and inert background for free—so I don’t hand-roll a11y under time pressure.

> Data flow: `Open button → setIsOpen(true) → Modal calls showModal() → onClose → setIsOpen(false) + restore focus`.

---

## While coding (decision points)

| You’re writing… | Say… |
|-----------------|------|
| Controlled `isOpen` | Parent owns open/close. Modal is presentational + imperative bridge to the dialog element. |
| Always mount `<dialog>` | Don’t `return null` when closed. Keep the node mounted so I can call `showModal()` / `close()` on the same ref. |
| `showModal()` vs `open` attr | `showModal()` is the modal path: top layer, `::backdrop`, Escape, focus trap, inert page. Plain `open` is non-modal—weaker a11y. |
| Sync in `useEffect` | React state is declarative; dialog open/close is imperative. Effect bridges `isOpen` → `dialog.showModal()` / `dialog.close()`. |
| `aria-labelledby` + `useId` | Title is the accessible name. `useId` keeps the id stable and unique if multiple modals exist. |
| Fallback `aria-label` | If there’s no title, still name the dialog so screen readers don’t get an unnamed dialog. |
| Close button `aria-label` | Visible “X” isn’t enough; label it “Close modal” (or similar). |
| Backdrop click | With `showModal()`, click on the dialog element itself (not children) means backdrop—then call `onClose`. |
| Don’t invent focus trap | Browser already traps Tab inside a modal dialog. I’d only hand-write trap if we can’t use `<dialog>`. |

---

## Focus management (say this clearly)

> Three jobs: move focus in on open, trap while open, restore on close.

> **Open / trap:** `showModal()` handles both—focus moves into the dialog, Tab stays inside, background is inert.

> **Restore:** Before open I remember `document.activeElement` (or keep a ref on the trigger in the parent). On close I `focus()` that element again so keyboard users aren’t dumped on `body`.

> Parent pattern: trigger `ref` + in `onClose` do `setIsOpen(false)` then `queueMicrotask(() => triggerRef.current?.focus())` so focus runs after the dialog actually closes.

> If they ask “why not only Modal-internal restore?”: either works. Parent trigger ref is explicit; saving `document.activeElement` inside Modal is more reusable.

---

## Manual focus trap (only if they ban `<dialog>`)

> Query focusable nodes inside the root. On Tab at the last item, wrap to first; on Shift+Tab at the first, wrap to last.
> On open: save previous focus, focus first focusable (or the container with `tabIndex={-1}`).
> On Escape: close. On close: restore previous focus.
> Also need backdrop, scroll lock, and inert/`aria-hidden` on the rest of the page—that’s why I prefer native dialog.

---

## Accessibility (say while wiring a11y)

> Native modal dialog + labelled by title (or `aria-label` fallback) + labelled close control + focus restore to trigger.
> Escape and focus trap come from `showModal()`, not custom key handlers.
> Gaps I’d call out if time: return focus in one place only (avoid double-focus from both parent and Modal), wire backdrop click via `e.target === dialog`, listen to the dialog `close`/`cancel` events to keep React state in sync with Escape.

---

## Trade-offs / follow-ups (pick 2–3)

> `showModal()` needs a real DOM node—keep dialog mounted; don’t unmount on close.

> Escape fires `cancel` then `close`; if React `isOpen` must stay in sync, listen to `close` and call `onClose` carefully so you don’t loop (`close` → `onClose` → `setIsOpen(false)` → effect `close()` again is usually fine if already closed).

> Portal: not required with top-layer dialog; required if you build a custom overlay with `div`s.

> Scroll locking: modal dialog generally handles interaction with the page; body scroll quirks may still need a small lock in some browsers.

> Animation: `close()` is instant; exit animations need `close` delayed or the new `dialog` invoker/animation patterns—out of scope for a basic round.

> Multiple modals: stack carefully; prefer one modal at a time in an interview unless asked.

---

## Wrap-up (~30s)

> What works: controlled open state, native `showModal()` for trap/Escape/backdrop semantics, titled dialog, close button, focus returned to the trigger.
> Structure: App owns `isOpen` + trigger ref; Modal owns dialog ref and imperative sync.
> Known gaps: harden backdrop-click and `close` event sync; avoid duplicating focus restore in two places.
> If we have time, I’d demo Escape and Tab to show the browser trap, then show focus landing back on “Open modal”.

---

## Accessibility one-liner

> Semantically: `<dialog>` opened with `showModal()`, named via `aria-labelledby` or `aria-label`, close control has an accessible name, focus moves in and is trapped by the browser, and on close focus returns to the trigger. Gaps I’d call out: single ownership of focus restore, explicit backdrop-click handling, and React state sync on native Escape/`close`.

---

## When stuck

> I’ll get open/close via `showModal()`/`close()` first, then title naming, then focus restore to the trigger.
> Happy to sketch a manual Tab trap if we assume no `<dialog>`—but I’d say that’s plan B.

---

## Accessibility checklist (interview priority)

### Already good to mention

- Controlled `isOpen` synced to `showModal()` / `close()`
- `<dialog>` instead of a styled `div role="dialog"` when possible
- `aria-labelledby` + `useId` when there is a title
- Fallback `aria-label` when there isn’t
- Close button `aria-label`
- Focus restore to trigger after close

### Still worth adding / calling out

1. **Backdrop click** — `onClick` on dialog: if `e.target === e.currentTarget`, close.
2. **Native `close` / `cancel`** — Keep `isOpen` aligned when the user hits Escape.
3. **One place for focus restore** — Parent trigger ref *or* saved `activeElement` in Modal, not both fighting.
4. **Initial focus** — Default browser behavior is usually enough; override only if product wants focus on a specific field.
5. **Don’t `return null` when closed** — Breaks imperative dialog API and makes reopen flaky.

---

## Common interviewer prompts → short answers

| Prompt | Answer |
|--------|--------|
| Why `<dialog>`? | Built-in modal semantics: trap, Escape, backdrop, inert background. |
| Why `showModal()` not `open`? | `open` is non-modal; `showModal()` is the accessible modal path. |
| How do you trap focus? | I don’t, if using `showModal()`. Browser does. Manual trap only for custom overlays. |
| Where does focus go on close? | Back to the control that opened it—save ref or `document.activeElement`. |
| Why keep dialog mounted? | Need a stable node for `showModal()`/`close()`; unmounting fights the API. |
| Click-outside? | With modal dialog, treat click on the dialog element (backdrop) as outside. |
| Portal needed? | Not for top-layer `showModal()`. Yes for custom `div` overlays to escape overflow/stacking. |
| How do you test? | Open → dialog open + focus inside; Tab stays inside; Escape closes; focus returns to trigger. |
| Production next steps? | Sync `close` event, backdrop click, optional scroll lock, animation, typed props. |
