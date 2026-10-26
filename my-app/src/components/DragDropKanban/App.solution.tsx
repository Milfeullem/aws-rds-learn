/**
 * Reference solution — compare after you finish the skeleton.
 * To run: in src/App.tsx
 *   import App from './components/DragDropKanban/App.solution'
 */
import { useState } from "react";
import "./styles.css";

import Board from "./components/Board";
import { initialColumns } from "./data";
import type { CardId, Column, ColumnId, DragState, DropTarget } from "./types";
import { moveCard } from "./utils/board";

export default function App() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [drag, setDrag] = useState<DragState>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget>(null);

  const onDragStartCard = (cardId: CardId, columnId: ColumnId) => {
    setDrag({ cardId, fromColumnId: columnId });
  };

  const onDragEndCard = () => {
    setDrag(null);
    setDropTarget(null);
  };

  const onDragOverColumn = (columnId: ColumnId, index: number) => {
    setDropTarget((prev) => {
      if (prev?.columnId === columnId && prev.index === index) {
        return prev;
      }
      return { columnId, index };
    });
  };

  const onDropOnColumn = (columnId: ColumnId, index: number) => {
    if (!drag) {
      return;
    }

    setColumns((prev) =>
      moveCard(prev, drag.cardId, drag.fromColumnId, columnId, index),
    );
    setDrag(null);
    setDropTarget(null);
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
