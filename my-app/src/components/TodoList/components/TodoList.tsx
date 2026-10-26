import { useId, useState } from "react";
import CreateItem from "./CreateItem";
import ItemList from "./ItemList";

export default function TodoList() {
  const [list, setList] = useState([]);

  const baseId = useId();
  const inputId = `${baseId}-input`;

  const onCreateItem = (name) => {
    setList((pre) => {
      const next = [...pre];
      const id = Date.now();

      next.push({ id, name, done: false });
      return next;
    });
  };

  const removeItem = (id) => {
    setList((pre) => {
      return pre.filter((item) => item.id !== id);
    });
  };

  const onToggleComplete = (id) => {
    setList((pre) => {
      return pre.map((item) => {
        if (item.id === id) {
          return { ...item, done: !item.done };
        }

        return item;
      });
    });
  };

  return (
    <section className="todo-list">
      <CreateItem id={inputId} onCreate={onCreateItem} />
      <ItemList
        list={list}
        onToggleComplete={onToggleComplete}
        removeItem={removeItem}
      />
    </section>
  );
}
