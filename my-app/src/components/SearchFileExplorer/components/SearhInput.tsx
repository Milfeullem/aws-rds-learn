import { useRef } from "react";

export default function SearchInput({ id, query, onChange }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <search>
      <label htmlFor={id}>Search File: </label>
      <input
        ref={inputRef}
        id={id}
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onClear} aria-label="clear search">
        Clear
      </button>
    </search>
  );
}
