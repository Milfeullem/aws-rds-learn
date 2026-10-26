import clsx from "../../ProductPurchase/utils/clsx";

const statusCopy = {
  idle: "Type a product or category to search the mock catalog.",
  loading: "Searching latest query...",
  success: "Results updated for the latest query.",
  empty: "No products match this query.",
};

export default function SearchStatus({ status, error, onRetry }) {
  let content = (
    <>
      <strong>{status}</strong>
      <p>{statusCopy[status]}</p>
    </>
  );

  if (status === "error") {
    content = (
      <>
        <strong>Search faild</strong>
        <p>{error}</p>
      </>
    );
  }

  return (
    <section className="status card" aria-label="Search status">
      <output
        className={clsx(status === "error" ? "error" : "")}
        aria-live="polite"
      >
        {content}
      </output>
      {status === "error" ? (
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </section>
  );
}
