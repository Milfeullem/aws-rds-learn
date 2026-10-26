import type { RefObject } from "react";
import type { FeedItem, FeedStatus } from "../types";
import FeedCard from "./FeedCard";

export default function FeedList({
  items,
  status,
  listId,
  sentinelRef,
  showSentinel,
}: {
  items: FeedItem[];
  status: FeedStatus;
  listId: string;
  sentinelRef: RefObject<HTMLDivElement | null>;
  showSentinel: boolean;
}) {
  if (status === "empty") {
    return null;
  }

  return (
    <section className="feed-list" aria-labelledby={listId}>
      <h2 id={listId} className="sr-only">
        Feed items
      </h2>
      <ul className="feed-list__items">
        {items.map((item) => (
          <li key={item.id}>
            <FeedCard item={item} />
          </li>
        ))}
      </ul>

      {/* Sentinel sits after the last card; observer triggers the next page fetch. */}
      {showSentinel ? (
        <div
          ref={sentinelRef}
          className="feed-sentinel"
          aria-hidden="true"
        />
      ) : null}
    </section>
  );
}
