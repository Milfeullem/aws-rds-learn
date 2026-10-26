export type CommentId = string;

export type Comment = {
  id: CommentId;
  author: string;
  body: string;
  createdAt: number;
  children: Comment[];
};

export type CommentDraft = {
  author: string;
  body: string;
};
