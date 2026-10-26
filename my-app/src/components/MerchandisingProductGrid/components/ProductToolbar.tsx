export default function ProductToolbar({
  query,
  onQueryChange,
  category,
  categoryOptions,
  onCategoryChange,
  sort,
  sortOptions,
  onSortChange,
}) {
  return (
    <section className="tool-bar" aria-label="Catalog controls">
      <label>
        <span>Search</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search producs or categories"
        />
      </label>
      <label>
        <span>Category</span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categoryOptions.map((item) => {
            return <option key={item}>{item}</option>;
          })}
        </select>
      </label>
      <label>
        <span>Sort</span>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          {sortOptions.map((item) => {
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
      </label>
    </section>
  );
}
