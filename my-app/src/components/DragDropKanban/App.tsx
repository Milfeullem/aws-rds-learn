/**
 * Drag & Drop Kanban — practice skeleton
 *
 * Goal (45–60 min):
 * 1. Three columns; cards nested in each column
 * 2. HTML5 DnD: dragStart / dragOver (preventDefault) / drop / dragEnd
 * 3. moveCard helper: cross-column + same-column reorder
 * 4. Ephemeral drag + dropTarget state (not in the board model)
 * 5. Drop indicator at hover index
 * 6. Clear drag UI on dragEnd even if drop never fired
 *
 * Wire in src/App.tsx:
 *   import App from './components/DragDropKanban/App'
 *
 * Self-check: open App.solution.tsx after you finish.
 */
import { useState } from "react";
import "./styles.css";

import Board from "./components/Board";
import { initialColumns } from "./data";
import type { CardId, Column, ColumnId, DragState, DropTarget } from "./types";
import { moveCard } from "./utils/board";

export default function App() {
  // TODO: board membership — cards live inside column.cards[]
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  // TODO: ephemeral DnD UI — which card is being dragged
  const [drag, setDrag] = useState<DragState>(null);

  // TODO: where would it land if dropped now? (columnId + index)
  const [dropTarget, setDropTarget] = useState<DropTarget>(null);

  const onDragStartCard = (_cardId: CardId, _columnId: ColumnId) => {
    void _cardId;
    void _columnId;
    // TODO: setDrag({ cardId, fromColumnId })
  };

  const onDragEndCard = () => {
    // TODO: clear drag + dropTarget (browser may skip drop on cancel)
  };

  const onDragOverColumn = (_columnId: ColumnId, _index: number) => {
    void _columnId;
    void _index;
    // TODO: setDropTarget({ columnId, index })
    // Tip: skip setState if same target to avoid thrashing on every dragOver
  };

  /**
   * TODO(interview): commit the move
   * - Need drag.fromColumnId + drop columnId/index
   * - setColumns(moveCard(...))
   * - clear drag + dropTarget
   * - Speak: “preventDefault already happened in Column; here we only mutate”
   */
  const onDropOnColumn = (_columnId: ColumnId, _index: number) => {
    void _columnId;
    void _index;
    void moveCard;
    void setColumns;
    void setDrag;
    void setDropTarget;
    // YOUR CODE HERE
  };

  return (
    <main className="app">
      <section className="hero" aria-labelledby="kanban-title">
        <p className="eyebrow">Premium React Case</p>
        <h1 id="kanban-title">Drag &amp; Drop Kanban</h1>
        <p>
          HTML5 DnD, immutable moveCard, drag UI state separate from the board
          model.
        </p>
      </section>

      <Board
        columns={columns}
        drag={drag}
        dropTarget={dropTarget}
        onDragStartCard={onDragStartCard}
        onDragEndCard={onDragEndCard}
        onDragOverColumn={onDragOverColumn}
        onDropOnColumn={onDropOnColumn}
      />
    </main>
  );
}
