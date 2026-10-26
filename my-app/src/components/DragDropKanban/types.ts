export type CardId = string;
export type ColumnId = string;

export type Card = {
  id: CardId;
  title: string;
};

export type Column = {
  id: ColumnId;
  title: string;
  cards: Card[];
};

/** Ephemeral DnD UI — not part of the board model. */
export type DragState = {
  cardId: CardId;
  fromColumnId: ColumnId;
} | null;

export type DropTarget = {
  columnId: ColumnId;
  /** Index in the destination column *after* the card is removed from source. */
  index: number;
} | null;
