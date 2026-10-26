# Tabs Component — Interview Talking Points

> Speak this in ~2–3 minutes. Expand only if the interviewer digs in.

---

## 1. One-liner

I built an accessible Tabs component following the WAI-ARIA APG pattern: a `tablist` of `tab`s that control matching `tabpanel`s, with keyboard support and a roving tabindex.

---

## 2. API / structure

- Props: `tabs` (`id`, `label`, `content`), optional `defaultTab`, optional `label` for the tablist name.
- Uncontrolled for now: internal `active` state; easy to extend with controlled `value` / `onChange`.
- Guard empty `tabs` and invalid `defaultTab` — fall back to the first tab.

---

## 3. Accessibility (what interviewers care about)

**Semantics**

- `role="tablist"` + `aria-label`
- Each tab: `role="tab"`, `aria-selected`, `aria-controls` → panel id
- Each panel: `role="tabpanel"`, `aria-labelledby` → tab id, `hidden` when inactive
- Native `<button>` so Enter/Space work for free

**Roving tabindex**

- Only the selected tab is `tabIndex={0}`; others are `-1`
- Tab key: enter the tablist once → then into the panel (`tabIndex={0}` on the panel)
- Arrow keys move *within* the list — not the Tab key

**Keyboard (automatic activation)**

| Key | Behavior |
|-----|----------|
| ← / → | Previous / next tab (wraps), activate + focus |
| Home / End | First / last tab |
| Enter / Space | Activate via native button (click path) |

I `preventDefault` on arrows so the page doesn’t scroll, then `activate(id)` which updates state and focuses the target via a ref map.

---

## 4. Implementation sketch (say out loud)

1. Resolve initial active id safely.
2. Keep a `Map` of tab button refs so I can focus after keyboard moves.
3. `activate(id)` = set state + focus.
4. `onKeyDown` on each tab: compute next index, activate.
5. Render panels; only the active one is shown with `hidden`.

---

## 5. Trade-offs / follow-ups (if asked)

- **Automatic vs manual activation**: I used automatic (arrow = select). Manual would move focus with arrows and activate only on Enter/Space — better when switching tabs is expensive (e.g. fetches).
- **Controlled mode**: add `value` + `onChange` for forms / URL sync.
- **Vertical tabs**: `aria-orientation="vertical"` + Up/Down instead of Left/Right.
- **Lazy panels**: mount content only when selected to save work.
- **Why not put `aria-label` on every tab?** Visible text is already the accessible name; `role="tab"` is announced by AT — extra labels are noise.

---

## 6. 30-second closing

“Core idea is APG: correct roles and relationships, roving tabindex so Tab doesn’t trap you in every tab, and arrow keys for navigation with automatic activation. That’s the bar for a production-ready tabs widget in an interview.”
