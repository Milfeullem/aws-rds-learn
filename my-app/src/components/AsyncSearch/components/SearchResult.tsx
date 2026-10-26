export default function SearchResult({ status, results, id }) {
  if (status === "idle") {
    return (
      <section className="empty-panel">
        <h2>Ready to search</h2>
        <p>The UI should not show stale results before intent exists.</p>
      </section>
    );
  }

  if (status === "loading") {
    return (
      <section className="empty-panel" aria-busy="true">
        <h2>Loading</h2>
        <p>
          Previous rows are cleared so stale results do not masquerade as fresh
          data.
        </p>
      </section>
    );
  }

  if (status === "empty") {
    return (
      <section className="empty-panel">
        <h2>No matches</h2>
        <p>Empty is a real async state, not the same as idle.</p>
      </section>
    );
  }

  return (
    <ul className="results" aria-label="Search results" id={id}>
      {results.map((product) => {
        return (
          <li key={product.id}>
            <div>
              <h2>{product.name}</h2>
              <p>{product.category}</p>
            </div>
            <div>
              <strong>{product.price}</strong>
              <span>{product.rating.toFixed(1)} rating</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
