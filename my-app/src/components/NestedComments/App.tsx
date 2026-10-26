/**
 * Nested Comments — practice skeleton
 *
 * Goal (45–60 min):
 * 1. Render a recursive comment tree
 * 2. Post root comments
 * 3. Reply under one node at a time (replyTargetId)
 * 4. Delete a node + its subtree (immutable)
 * 5. Collapse / expand replies (Set of ids)
 * 6. Keep draft UI state out of the tree model
 *
 * Wire in src/App.tsx:
 *   import App from './components/NestedComments/App'
 *
 * Self-check: App.solution.tsx
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

  // TODO: which comment is showing a reply form? null = none
  const [replyTargetId, setReplyTargetId] = useState<CommentId | null>(null);

  // TODO: collapsed thread ids — prefer Set; clone on update
  const [collapsedIds, setCollapsedIds] = useState<Set<CommentId>>(
    () => new Set(),
  );

  const total = useMemo(() => countComments(comments), [comments]);

  const onCreateRoot = (_draft: CommentDraft) => {
    void _draft;
    void createComment;
    void appendComment;
    // TODO: createComment → appendComment(tree, null, next) → setComments
    // clear replyTargetId if you want a clean composer focus
  };

  const onSubmitReply = (_parentId: CommentId, _draft: CommentDraft) => {
    void _parentId;
    void _draft;
    // TODO: append under parentId; then setReplyTargetId(null)
  };

  const onDelete = (_id: CommentId) => {
    void _id;
    void removeComment;
    // TODO: removeComment(tree, id); if deleting the active reply target, clear it
  };

  const onToggleCollapse = (_id: CommentId) => {
    void _id;
    // TODO: new Set(prev); add or delete id
    void setCollapsedIds;
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
