import type { FeedItem, FeedPage } from "./types";

const CATEGORIES = ["Design", "React", "Performance", "A11y", "System"];

/** ~120 items so you can scroll through several pages in an interview. */
const ALL_ITEMS: FeedItem[] = Array.from({ length: 120 }, (_, index) => {
  const n = index + 1;
  const category = CATEGORIES[index % CATEGORIES.length];

  return {
    id: `feed-${n}`,
    title: `${category} note #${n}`,
    category,
    summary: `Short summary for item ${n}. Cursor pages keep appending without resetting scroll.`,
    likes: 3 + ((index * 17) % 90),
  };
});

function createAbortError() {
  return new DOMException("The feed request was aborted.", "AbortError");
}

function parseCursor(cursor: string | null): number {
  if (!cursor) {
    return 0;
  }

  const offset = Number(cursor.replace("cursor-", ""));
  return Number.isFinite(offset) ? offset : 0;
}

/**
 * Cursor-based page API (closer to real feeds than page=1,2,3).
 * Tips for demos:
 * - query includes "error" → reject once (retry should work)
 * - query includes "slow" → 900ms latency
 */
export function mockFetchFeedPage({
  cursor = null,
  limit = 12,
  query = "",
  signal,
}: {
  cursor?: string | null;
  limit?: number;
  query?: string;
  signal?: AbortSignal;
} = {}): Promise<FeedPage> {
  const normalized = query.trim().toLowerCase();
  const latency = normalized.includes("slow") ? 900 : 320;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (signal?.aborted) {
        reject(createAbortError());
        return;
      }

      if (normalized.includes("error") && !cursor) {
        reject(new Error("Feed service failed. Try again."));
        return;
      }

      const filtered = normalized
        ? ALL_ITEMS.filter(
            (item) =>
              item.title.toLowerCase().includes(normalized) ||
              item.category.toLowerCase().includes(normalized),
          )
        : ALL_ITEMS;

      const start = parseCursor(cursor);
      const slice = filtered.slice(start, start + limit);
      const nextStart = start + slice.length;
      const hasMore = nextStart < filtered.length;

      resolve({
        items: slice,
        nextCursor: hasMore ? `cursor-${nextStart}` : null,
        hasMore,
      });
    }, latency);

    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId);
        reject(createAbortError());
      },
      { once: true },
    );
  });
}
