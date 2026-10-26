import { useEffect, useId, useRef } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const preFocusElem = useRef<HTMLElement>(null);
  const baseId = useId();
  const titleId = `${baseId}-title`;

  useEffect(() => {
    const dialog = modalRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen) {
      preFocusElem.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    function closeOutside(e) {
      if (!modalRef.current?.contains(e.target)) {
        onClose();
        preFocusElem.current?.focus();
      }
    }

    modalRef.current.addEventListener("close", closeOutside);

    return () => {
      modalRef.current?.removeEventListener("close", closeOutside);
    };
  }, [onClose]);

  return (
    <dialog
      ref={modalRef}
      aria-modal="true"
      aria-label={title ? undefined : "Modal"}
      aria-labelledby={title ? titleId : undefined}
    >
      <div>
        {title ? <h2 id={titleId}>{title}</h2> : null}
        <button onClick={onClose} aria-label="close modal">
          X
        </button>
      </div>
      <div className="dialog-content">{children}</div>
    </dialog>
  );
}
