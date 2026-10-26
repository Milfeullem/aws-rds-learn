import type { ItemId, TransferItem } from "../types";

/** Immutable toggle for a Set of checked ids. */
export function toggleChecked(
  checked: Set<ItemId>,
  id: ItemId,
): Set<ItemId> {
  const next = new Set(checked);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

/**
 * Move items whose ids are in `checked` from `source` → `target`.
 * Preserves relative order within the moved batch; appends to target.
 * Returns cleared checked set for the source side.
 */
export function moveSelected(
  source: TransferItem[],
  target: TransferItem[],
  checked: Set<ItemId>,
): {
  source: TransferItem[];
  target: TransferItem[];
  checked: Set<ItemId>;
} {
  if (checked.size === 0) {
    return { source, target, checked };
  }

  const moving: TransferItem[] = [];
  const remaining: TransferItem[] = [];

  for (const item of source) {
    if (checked.has(item.id)) {
      moving.push(item);
    } else {
      remaining.push(item);
    }
  }

  return {
    source: remaining,
    target: [...target, ...moving],
    checked: new Set(),
  };
}

/** Move every item from `source` → `target`. Clears source checked. */
export function moveAll(
  source: TransferItem[],
  target: TransferItem[],
): {
  source: TransferItem[];
  target: TransferItem[];
  checked: Set<ItemId>;
} {
  if (source.length === 0) {
    return { source, target, checked: new Set() };
  }

  return {
    source: [],
    target: [...target, ...source],
    checked: new Set(),
  };
}

/** True when every visible item id is checked (and list is non-empty). */
export function isAllChecked(
  items: TransferItem[],
  checked: Set<ItemId>,
): boolean {
  return items.length > 0 && items.every((item) => checked.has(item.id));
}

/** Check or uncheck every id currently in `items`. */
export function setAllChecked(
  items: TransferItem[],
  checked: boolean,
): Set<ItemId> {
  if (!checked) {
    return new Set();
  }
  return new Set(items.map((item) => item.id));
}
