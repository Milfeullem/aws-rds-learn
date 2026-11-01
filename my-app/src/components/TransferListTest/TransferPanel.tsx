export default function TransferPanel({ id, items, checkedItems, onChange }) {
  const isCheckedAll = checkedItems.size === items.size;

  const onSelectAll = () => {
    onChange(items);
  };

  return (
    <ul>
      <li>
        <input
          id={id}
          checked={isCheckedAll}
          type="checkbox"
          onChange={onSelectAll}
        />
        <label htmlFor={id}>Select All</label>
      </li>
      {items.map((name) => {
        const isChecked = checkedItems.has(name);

        return (
          <li key={name}>
            <input
              id={name}
              type="checkbox"
              checked={isChecked}
              onChange={() => onChange([name])}
            />
            <label htmlFor={name}>{name}</label>
          </li>
        );
      })}
    </ul>
  );
}
