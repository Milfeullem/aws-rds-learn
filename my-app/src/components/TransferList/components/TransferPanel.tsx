import type { ItemId, TransferItem } from "../types";
import { isAllChecked } from "../utils/transfer";

export default function TransferPanel({
  title,
  items,
  checked,
  listId,
  selectAllId,
  onToggle,
  onToggleAll,
}: {
  title: string;
  items: TransferItem[];
  checked: Set<ItemId>;
  listId: string;
  selectAllId: string;
  onToggle: (id: ItemId) => void;
  onToggleAll: (next: boolean) => void;
}) {
  const allChecked = isAllChecked(items, checked);
  const selectedCount = items.filter((item) => checked.has(item.id)).length;

  return (
    <section className="transfer-panel" aria-labelledby={`${listId}-title`}>
      <header className="transfer-panel__header">
        <h2 id={`${listId}-title`}>{title}</h2>
        <p className="transfer-panel__meta" aria-live="polite">
          {selectedCount}/{items.length} selected
        </p>
      </header>

      <label className="transfer-panel__all" htmlFor={selectAllId}>
        <input
          id={selectAllId}
          type="checkbox"
          checked={allChecked}
          disabled={items.length === 0}
          onChange={(event) => onToggleAll(event.target.checked)}
        />
        Select all
      </label>

      {items.length === 0 ? (
        <p className="transfer-panel__empty" aria-live="polite">
          No items
        </p>
      ) : (
        <ul id={listId} className="transfer-panel__list" role="list">
          {items.map((item) => {
            const inputId = `${listId}-${item.id}`;
            return (
              <li key={item.id}>
                <label htmlFor={inputId}>
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked.has(item.id)}
                    onChange={() => onToggle(item.id)}
                  />
                  {item.label}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
