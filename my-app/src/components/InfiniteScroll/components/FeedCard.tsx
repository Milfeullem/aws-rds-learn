import type { FeedItem } from "../types";

export default function FeedCard({ item }: { item: FeedItem }) {
  return (
    <article className="feed-card">
      <header className="feed-card__header">
        <span className="feed-card__category">{item.category}</span>
        <span className="feed-card__likes" aria-label={`${item.likes} likes`}>
          {item.likes}
        </span>
      </header>
      <h2 className="feed-card__title">{item.title}</h2>
      <p className="feed-card__summary">{item.summary}</p>
    </article>
  );
}
