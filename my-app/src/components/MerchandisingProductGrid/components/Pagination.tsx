export default function Pagination({ page, totalPage, onChange }) {
  return (
    <nav className="pagination" aria-label="Product pages">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(Math.max(1, page - 1))}
      >
        Previous
      </button>
      <span aria-current="page">
        Page {page} of {totalPage}
      </span>
      <button
        type="button"
        disabled={page >= totalPage}
        onClick={() => onChange(Math.min(totalPage, page + 1))}
      >
        Next
      </button>
    </nav>
  );
}
