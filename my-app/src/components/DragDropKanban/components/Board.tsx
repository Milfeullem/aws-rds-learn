import type { CardId, Column, ColumnId, DragState, DropTarget } from "../types";
import KanbanColumn from "./Column";

export default function Board({
  columns,
  drag,
  dropTarget,
  onDragStartCard,
  onDragEndCard,
  onDragOverColumn,
  onDropOnColumn,
}: {
  columns: Column[];
  drag: DragState;
  dropTarget: DropTarget;
  onDragStartCard: (cardId: CardId, columnId: ColumnId) => void;
  onDragEndCard: () => void;
  onDragOverColumn: (columnId: ColumnId, index: number) => void;
  onDropOnColumn: (columnId: ColumnId, index: number) => void;
}) {
  const draggingId = drag?.cardId ?? null;

  return (
    <div className="kanban-board" role="region" aria-label="Kanban board">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          draggingId={draggingId}
          dropTarget={dropTarget}
          onDragStartCard={onDragStartCard}
          onDragEndCard={onDragEndCard}
          onDragOverColumn={onDragOverColumn}
          onDropOnColumn={onDropOnColumn}
        />
      ))}
    </div>
  );
}
