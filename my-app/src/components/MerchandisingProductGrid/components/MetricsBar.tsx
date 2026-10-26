export default function MetricsBar({ total, Matching, page, totalPages }) {
  return (
    <section
      className="metrics"
      aria-label="Catalog summary"
      aria-live="polite"
      aria-atomic="true"
    >
      <div>
        <span>Total SKUs</span>
        <strong>{total}</strong>
      </div>
      <div>
        <span>Matching</span>
        <strong>{Matching}</strong>
      </div>
      <div>
        <span>Page</span>
        <strong>
          {page} / {totalPages}
        </strong>
      </div>
    </section>
  );
}
