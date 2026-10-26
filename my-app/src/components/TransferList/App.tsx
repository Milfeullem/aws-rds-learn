/**
 * Transfer List — practice skeleton
 *
 * Goal (45–60 min):
 * 1. Two panels: Available (left) / Chosen (right)
 * 2. Checkbox select per item + Select all
 * 3. Move selected → / ← ; Move all →→ / ←←
 * 4. Disable controls when nothing to move
 * 5. Clear checked ids on the side you moved from
 * 6. Keep selection (Set) separate from list membership (arrays)
 *
 * Wire in src/App.tsx:
 *   import App from './components/TransferList/App'
 *
 * Self-check: open App.solution.tsx after you finish.
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
  // TODO: membership — which items live on which side
  const [left, setLeft] = useState<TransferItem[]>(initialLeft);
  const [right, setRight] = useState<TransferItem[]>(initialRight);

  // TODO: selection is UI state — prefer Set; clone on update
  const [leftChecked, setLeftChecked] = useState<Set<ItemId>>(() => new Set());
  const [rightChecked, setRightChecked] = useState<Set<ItemId>>(
    () => new Set(),
  );

  const baseId = useId();
  const leftListId = `${baseId}-left`;
  const rightListId = `${baseId}-right`;

  const onToggleLeft = (_id: ItemId) => {
    void _id;
    void toggleChecked;
    // TODO: setLeftChecked(prev => toggleChecked(prev, id))
  };

  const onToggleRight = (_id: ItemId) => {
    void _id;
    // TODO: setRightChecked(prev => toggleChecked(prev, id))
  };

  const onToggleAllLeft = (_next: boolean) => {
    void _next;
    void setAllChecked;
    // TODO: setLeftChecked(setAllChecked(left, next))
  };

  const onToggleAllRight = (_next: boolean) => {
    void _next;
    // TODO: setRightChecked(setAllChecked(right, next))
  };

  /**
   * TODO(interview): implement four movers
   * - moveSelected(source, target, checked) → update both arrays + clear source checked
   * - moveAll(source, target) → same, clear source checked
   * - Speak: “membership arrays are data; Sets are view state”
   */
  const onMoveRight = () => {
    void moveSelected;
    // YOUR CODE HERE — left → right using leftChecked
  };

  const onMoveLeft = () => {
    // YOUR CODE HERE — right → left using rightChecked
  };

  const onMoveAllRight = () => {
    void moveAll;
    // YOUR CODE HERE
  };

  const onMoveAllLeft = () => {
    // YOUR CODE HERE
  };

  // TODO: derive disabled flags from checked.size / array length
  const canMoveRight = false;
  const canMoveLeft = false;
  const canMoveAllRight = false;
  const canMoveAllLeft = false;

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
