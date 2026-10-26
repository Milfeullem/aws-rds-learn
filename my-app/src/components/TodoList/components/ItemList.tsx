import { useRef } from "react";

export default function ItemList({ list, onToggleComplete, removeItem }) {
  const listRef = useRef(null);

  if (list.length === 0) {
    return <section aria-live="polite">create an item by input</section>;
  }

  const onRemove = (id) => {
    removeItem(id);
    listRef.current?.focus();
  };

  return (
    <ul ref={listRef} aria-label="todo list">
      {list.map(({ done, name, id }) => {
        return (
          <li key={id}>
            <input
              aria-label={`Mark ${name} as ${done ? "undone" : "done"}`}
              type="checkbox"
              checked={done}
              onChange={() => onToggleComplete(id)}
            />
            <span className={done ? "line-through" : ""}>{name}</span>
            <button aria-label={`Remove ${name}`} onClick={() => onRemove(id)}>
              X
            </button>
          </li>
        );
      })}
    </ul>
  );
}
