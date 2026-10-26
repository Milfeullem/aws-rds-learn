function getFocusable(root: HTMLElement) {
  return [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ];
}
function trapFocus(e: KeyboardEvent, root: HTMLElement) {
  if (e.key !== "Tab") return;
  const list = getFocusable(root);
  if (list.length === 0) return;
  const first = list[0];
  const last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
// open:
previouslyFocused.current = document.activeElement as HTMLElement;
getFocusable(modal)[0]?.focus() ?? modal.focus(); // modal 需 tabIndex={-1}
// keydown:
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") onClose();
  trapFocus(e, modal);
});
// close:
previouslyFocused.current?.focus();
