import type { CardId, Column as ColumnModel, ColumnId, DropTarget } from "../types";
import Card from "./Card";

/**
 * Drop zone = column body.
 * Must call preventDefault on dragOver or the browser won't fire drop.
 */
export default function Column({
  column,
  draggingId,
  dropTarget,
  onDragStartCard,
  onDragEndCard,
  onDragOverColumn,
  onDropOnColumn,
}: {
  column: ColumnModel;
  draggingId: CardId | null;
  dropTarget: DropTarget;
  onDragStartCard: (cardId: CardId, columnId: ColumnId) => void;
  onDragEndCard: () => void;
  onDragOverColumn: (columnId: ColumnId, index: number) => void;
  onDropOnColumn: (columnId: ColumnId, index: number) => void;
}) {
  const isOver =
    dropTarget?.columnId === column.id && draggingId !== null;

  return (
    <section
      className={`kanban-column${isOver ? " is-over" : ""}`}
      aria-labelledby={`column-${column.id}-title`}
    >
      <header className="kanban-column__header">
        <h2 id={`column-${column.id}-title`}>{column.title}</h2>
        <p className="kanban-column__count" aria-live="polite">
          {column.cards.length}
        </p>
      </header>

      <ul
        className="kanban-column__list"
        role="list"
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          // Drop at end when hovering empty space / below last card
          onDragOverColumn(column.id, column.cards.length);
        }}
        onDrop={(event) => {
          event.preventDefault();
          onDropOnColumn(column.id, column.cards.length);
        }}
      >
        {column.cards.map((card, index) => {
          const showIndicator =
            dropTarget?.columnId === column.id &&
            dropTarget.index === index &&
            draggingId !== null &&
            draggingId !== card.id;

          return (
            <li key={card.id} className="kanban-column__slot">
              {showIndicator ? (
                <div className="kanban-drop-indicator" aria-hidden />
              ) : null}
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  // Insert before this card
                  onDragOverColumn(column.id, index);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onDropOnColumn(column.id, index);
                }}
              >
                <Card
                  card={card}
                  isDragging={draggingId === card.id}
                  onDragStart={(cardId) =>
                    onDragStartCard(cardId, column.id)
                  }
                  onDragEnd={onDragEndCard}
                />
              </div>
            </li>
          );
        })}

        {column.cards.length === 0 ? (
          <li className="kanban-column__empty">Drop cards here</li>
        ) : null}

        {dropTarget?.columnId === column.id &&
        dropTarget.index === column.cards.length &&
        draggingId !== null ? (
          <li className="kanban-column__slot" aria-hidden>
            <div className="kanban-drop-indicator" />
          </li>
        ) : null}
      </ul>
    </section>
  );
}
