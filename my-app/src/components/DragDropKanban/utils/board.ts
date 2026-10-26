import type { Card, CardId, Column, ColumnId } from "../types";

/** Find which column holds a card. O(columns × cards) — fine for interview demos. */
export function findCardLocation(
  columns: Column[],
  cardId: CardId,
): { columnId: ColumnId; index: number } | null {
  for (const column of columns) {
    const index = column.cards.findIndex((card) => card.id === cardId);
    if (index !== -1) {
      return { columnId: column.id, index };
    }
  }
  return null;
}

/**
 * Immutable move: remove card from `fromColumnId`, insert into `toColumnId` at `toIndex`.
 * Same-column reorder clamps `toIndex` against the list *after* removal.
 * Returns the same `columns` reference if the move is a no-op.
 */
export function moveCard(
  columns: Column[],
  cardId: CardId,
  fromColumnId: ColumnId,
  toColumnId: ColumnId,
  toIndex: number,
): Column[] {
  const fromColumn = columns.find((column) => column.id === fromColumnId);
  if (!fromColumn) {
    return columns;
  }

  const fromIndex = fromColumn.cards.findIndex((card) => card.id === cardId);
  if (fromIndex === -1) {
    return columns;
  }

  const card: Card = fromColumn.cards[fromIndex];

  // Same column + same slot after clamp → no-op
  if (fromColumnId === toColumnId) {
    const without = fromColumn.cards.filter((item) => item.id !== cardId);
    // Hover index is against the *pre-removal* list (“insert before cards[i]”).
    // After removal, indices after fromIndex shift left by 1.
    const adjusted =
      fromIndex < toIndex ? toIndex - 1 : toIndex;
    const clamped = clampIndex(adjusted, without.length);
    if (clamped === fromIndex) {
      return columns;
    }

    const nextCards = [
      ...without.slice(0, clamped),
      card,
      ...without.slice(clamped),
    ];

    return columns.map((column) =>
      column.id === fromColumnId ? { ...column, cards: nextCards } : column,
    );
  }

  const nextFromCards = fromColumn.cards.filter((item) => item.id !== cardId);
  const toColumn = columns.find((column) => column.id === toColumnId);
  if (!toColumn) {
    return columns;
  }

  const clamped = clampIndex(toIndex, toColumn.cards.length);
  const nextToCards = [
    ...toColumn.cards.slice(0, clamped),
    card,
    ...toColumn.cards.slice(clamped),
  ];

  return columns.map((column) => {
    if (column.id === fromColumnId) {
      return { ...column, cards: nextFromCards };
    }
    if (column.id === toColumnId) {
      return { ...column, cards: nextToCards };
    }
    return column;
  });
}

function clampIndex(index: number, length: number): number {
  if (index < 0) {
    return 0;
  }
  if (index > length) {
    return length;
  }
  return index;
}
