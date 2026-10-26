import { useRef } from "react";

export default function SearchBox({ query, status, outputId, onChange, id }) {
  const inputRef = useRef(null);

  const onClear = () => {
    onChange("");

    inputRef.current?.focus();
  };

  return (
    <search className="search-card" aria-label="Product search control">
      <label htmlFor={id}>Search product</label>
      <div className="search-row">
        <input
          ref={inputRef}
          id={id}
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Try bag, hoodie, shoes, nomatch, or error"
          aria-controls={status === "success" ? outputId : undefined}
        />
        <button type="button" onClick={onClear} disabled={!query}>
          Clear
        </button>
      </div>
    </search>
  );
}
