import type { Card as CardModel, CardId } from "../types";

/**
 * Presentational card. Parent owns drag lifecycle.
 * Speak: “draggable + dragStart payload; no board mutation here.”
 */
export default function Card({
  card,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  card: CardModel;
  isDragging: boolean;
  onDragStart: (cardId: CardId) => void;
  onDragEnd: () => void;
}) {
  return (
    <article
      className={`kanban-card${isDragging ? " is-dragging" : ""}`}
      draggable
      onDragStart={(event) => {
        // Required for Firefox; also useful if you read dataTransfer on drop.
        event.dataTransfer.setData("text/plain", card.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart(card.id);
      }}
      onDragEnd={onDragEnd}
    >
      <p className="kanban-card__title">{card.title}</p>
    </article>
  );
}
