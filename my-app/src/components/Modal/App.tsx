import { useRef, useState } from "react";
import Modal from "./Modal";
// Tip: You can create new files by clicking on Expand file explorer icon in the top bar.
export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <main>
      <button ref={openBtnRef} onClick={() => setIsOpen(true)}>
        Open modal
      </button>
      <Modal
        isOpen={isOpen}
        title="test modal"
        onClose={() => {
          setIsOpen(false);
          queueMicrotask(() => openBtnRef.current?.focus());
        }}
      >
        Hello
      </Modal>
    </main>
  );
}
