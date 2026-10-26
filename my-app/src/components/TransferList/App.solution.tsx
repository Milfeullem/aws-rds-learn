/**
 * Reference solution — compare after you finish the skeleton.
 * To run: in src/App.tsx
 *   import App from './components/TransferList/App.solution'
 */
import { useId, useState } from "react";
import "./styles.css";

import TransferControls from "./components/TransferControls";
import TransferPanel from "./components/TransferPanel";
import { initialLeft, initialRight } from "./data";
import type { ItemId, TransferItem } from "./types";
import {
  moveAll,
  moveSelected,
  setAllChecked,
  toggleChecked,
} from "./utils/transfer";

export default function App() {
  const [left, setLeft] = useState<TransferItem[]>(initialLeft);
  const [right, setRight] = useState<TransferItem[]>(initialRight);
  const [leftChecked, setLeftChecked] = useState<Set<ItemId>>(() => new Set());
  const [rightChecked, setRightChecked] = useState<Set<ItemId>>(
    () => new Set(),
  );

  const baseId = useId();
  const leftListId = `${baseId}-left`;
  const rightListId = `${baseId}-right`;

  const onToggleLeft = (id: ItemId) => {
    setLeftChecked((prev) => toggleChecked(prev, id));
  };

  const onToggleRight = (id: ItemId) => {
    setRightChecked((prev) => toggleChecked(prev, id));
  };

  const onToggleAllLeft = (next: boolean) => {
    setLeftChecked(setAllChecked(left, next));
  };

  const onToggleAllRight = (next: boolean) => {
    setRightChecked(setAllChecked(right, next));
  };

  const onMoveRight = () => {
    const result = moveSelected(left, right, leftChecked);
    setLeft(result.source);
    setRight(result.target);
    setLeftChecked(result.checked);
  };

  const onMoveLeft = () => {
    const result = moveSelected(right, left, rightChecked);
    setRight(result.source);
    setLeft(result.target);
    setRightChecked(result.checked);
  };

  const onMoveAllRight = () => {
    const result = moveAll(left, right);
    setLeft(result.source);
    setRight(result.target);
    setLeftChecked(result.checked);
  };

  const onMoveAllLeft = () => {
    const result = moveAll(right, left);
    setRight(result.source);
    setLeft(result.target);
    setRightChecked(result.checked);
  };

  const canMoveRight = leftChecked.size > 0;
  const canMoveLeft = rightChecked.size > 0;
  const canMoveAllRight = left.length > 0;
  const canMoveAllLeft = right.length > 0;

  return (
    <main className="app">
      <section className="hero" aria-labelledby="transfer-title">
        <p className="eyebrow">Premium React Case</p>
        <h1 id="transfer-title">Transfer List</h1>
        <p>
          Two lists, checkbox selection, move selected / move all. Selection
          Sets stay out of the item model.
        </p>
      </section>

      <div className="transfer-layout">
        <TransferPanel
          title="Available"
          items={left}
          checked={leftChecked}
          listId={leftListId}
          selectAllId={`${baseId}-left-all`}
          onToggle={onToggleLeft}
          onToggleAll={onToggleAllLeft}
        />

        <TransferControls
          canMoveRight={canMoveRight}
          canMoveLeft={canMoveLeft}
          canMoveAllRight={canMoveAllRight}
          canMoveAllLeft={canMoveAllLeft}
          onMoveRight={onMoveRight}
          onMoveLeft={onMoveLeft}
          onMoveAllRight={onMoveAllRight}
          onMoveAllLeft={onMoveAllLeft}
        />

        <TransferPanel
          title="Chosen"
          items={right}
          checked={rightChecked}
          listId={rightListId}
          selectAllId={`${baseId}-right-all`}
          onToggle={onToggleRight}
          onToggleAll={onToggleAllRight}
        />
      </div>
    </main>
  );
}
