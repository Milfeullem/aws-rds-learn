import { useId, useState } from "react";
import TransferPanel from "./TransferPanel";
import TransferControls from "./TransferControls";

export default function App() {
  const [left, setLeft] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  const [right, setRight] = useState<Set<number>>(new Set([]));

  const [leftChecked, setLeftChecked] = useState<Set<number>>(new Set([]));
  const [rightChecked, setRightChecked] = useState<Set<number>>(new Set([]));

  const baseId = useId();
  const leftId = `${baseId}-left`;
  const rightId = `${baseId}-right`;

  const onRightChange = (items) => {
    setRightChecked((pre) => {
      const next = new Set(pre);

      items.forEach((i) => {
        if (next.has(i)) {
          next.delete(i);
        } else {
          next.add(i);
        }
      });

      return next;
    });
  };

  const onLeftChange = (items) => {
    setLeftChecked((pre) => {
      const next = new Set(pre);

      items.forEach((i) => {
        if (next.has(i)) {
          next.delete(i);
        } else {
          next.add(i);
        }
      });

      return next;
    });
  };

  const onMoveLeft = (items) => {
    setLeft((pre) => new Set([...pre, ...items]));
    setRight((pre) => {
      const next = new Set(pre);

      items.forEach((i) => next.delete(i));

      return next;
    });
    setRightChecked(new Set([]));
  };

  const onMoveRight = (items) => {
    setRight((pre) => new Set([...pre, ...items]));
    setLeft((pre) => {
      const next = new Set(pre);

      items.forEach((i) => next.delete(i));

      return next;
    });
    setLeftChecked(new Set([]));
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft" && rightChecked.size > 0) {
      onMoveLeft(rightChecked);

      return;
    }

    if (e.key === "ArrowRight" && leftChecked.size > 0) {
      onMoveRight(leftChecked);

      return;
    }
  };

  return (
    <main onKeyDown={onKeyDown}>
      <TransferPanel
        id={leftId}
        items={left}
        checkedItems={leftChecked}
        onChange={onLeftChange}
      />
      <TransferControls
        selectedLeft={leftChecked}
        selectedRight={rightChecked}
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
      />
      <TransferPanel
        id={rightId}
        items={right}
        checkedItems={rightChecked}
        onChange={onRightChange}
      />
    </main>
  );
}
