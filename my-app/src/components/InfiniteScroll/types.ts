export type FeedItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  likes: number;
};

export type FeedPage = {
  items: FeedItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type FeedStatus = "idle" | "loading" | "success" | "empty" | "error" | "end";
