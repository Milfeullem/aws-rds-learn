import type { FeedStatus } from "../types";

const copy: Record<FeedStatus, string> = {
  idle: "Scroll the feed or change the filter to load items.",
  loading: "Loading more items…",
  success: "Showing latest feed page.",
  empty: "No items match this filter.",
  error: "Something went wrong loading the feed.",
  end: "You’ve reached the end.",
};

export default function FeedStatus({
  status,
  error,
  onRetry,
}: {
  status: FeedStatus;
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <section className="feed-status" aria-label="Feed status">
      <output aria-live="polite">
        <strong>{status}</strong>
        <p>{status === "error" && error ? error : copy[status]}</p>
      </output>
      {status === "error" ? (
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </section>
  );
}
