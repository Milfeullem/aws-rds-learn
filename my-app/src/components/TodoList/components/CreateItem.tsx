import { useState } from "react";

export default function CreateItem({ id, onCreate }) {
  const [input, setInput] = useState("");

  const onCreateItem = () => {
    if (input.trim().length === 0) {
      return;
    }

    onCreate(input);
    setInput("");
  };

  const onKeydown = (e) => {
    if (e.key === "Enter") {
      onCreateItem();
    }
  };

  return (
    <div className="create-item">
      <label htmlFor={id}>Create Item:</label>
      <input
        id={id}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeydown}
      />
      <button aria-label="create item" onClick={onCreateItem}>
        Create
      </button>
    </div>
  );
}
