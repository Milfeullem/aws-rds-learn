/**
 * Reference solution — compare after you finish the skeleton.
 * To run: in src/App.tsx
 *   import App from './components/NestedComments/App.solution'
 */
import { useMemo, useState } from "react";
import "./styles.css";

import { initialComments } from "./data";
import CommentForm from "./components/CommentForm";
import CommentList from "./components/CommentList";
import {
  appendComment,
  countComments,
  createComment,
  removeComment,
} from "./utils/comments";
import type { Comment, CommentDraft, CommentId } from "./types";

export default function App() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyTargetId, setReplyTargetId] = useState<CommentId | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<CommentId>>(
    () => new Set(),
  );

  const total = useMemo(() => countComments(comments), [comments]);

  const onCreateRoot = (draft: CommentDraft) => {
    const next = createComment(draft.author, draft.body);
    setComments((tree) => appendComment(tree, null, next));
    setReplyTargetId(null);
  };

  const onSubmitReply = (parentId: CommentId, draft: CommentDraft) => {
    const next = createComment(draft.author, draft.body);
    setComments((tree) => appendComment(tree, parentId, next));
    setReplyTargetId(null);
    setCollapsedIds((prev) => {
      if (!prev.has(parentId)) {
        return prev;
      }
      const copy = new Set(prev);
      copy.delete(parentId);
      return copy;
    });
  };

  const onDelete = (id: CommentId) => {
    setComments((tree) => removeComment(tree, id));
    setReplyTargetId((current) => (current === id ? null : current));
    setCollapsedIds((prev) => {
      if (!prev.has(id)) {
        return prev;
      }
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });
  };

  const onToggleCollapse = (id: CommentId) => {
    setCollapsedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  return (
    <main className="app">
      <section className="hero" aria-labelledby="comments-title">
        <p className="eyebrow">Premium React Case</p>
        <h1 id="comments-title">Nested Comments</h1>
        <p>
          Recursive tree, single reply target, immutable insert/delete, collapse
          Set.
        </p>
      </section>

      <p className="metrics" aria-live="polite">
        {total} comment{total === 1 ? "" : "s"}
      </p>

      <section className="composer" aria-labelledby="composer-title">
        <h2 id="composer-title">New comment</h2>
        <CommentForm submitLabel="Post" onSubmit={onCreateRoot} />
      </section>

      <CommentList
        comments={comments}
        replyTargetId={replyTargetId}
        collapsedIds={collapsedIds}
        onReply={setReplyTargetId}
        onCancelReply={() => setReplyTargetId(null)}
        onSubmitReply={onSubmitReply}
        onDelete={onDelete}
        onToggleCollapse={onToggleCollapse}
      />
    </main>
  );
}
