import type { Comment, CommentDraft, CommentId } from "../types";
import CommentNode from "./CommentNode";

export default function CommentList({
  comments,
  replyTargetId,
  collapsedIds,
  onReply,
  onCancelReply,
  onSubmitReply,
  onDelete,
  onToggleCollapse,
}: {
  comments: Comment[];
  replyTargetId: CommentId | null;
  collapsedIds: Set<CommentId>;
  onReply: (id: CommentId) => void;
  onCancelReply: () => void;
  onSubmitReply: (parentId: CommentId, draft: CommentDraft) => void;
  onDelete: (id: CommentId) => void;
  onToggleCollapse: (id: CommentId) => void;
}) {
  if (comments.length === 0) {
    return (
      <p className="comment-empty" aria-live="polite">
        No comments yet. Be the first to post.
      </p>
    );
  }

  return (
    <ol className="comment-tree">
      {comments.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          depth={0}
          isReplying={replyTargetId === comment.id}
          isCollapsed={collapsedIds.has(comment.id)}
          replyTargetId={replyTargetId}
          collapsedIds={collapsedIds}
          onReply={onReply}
          onCancelReply={onCancelReply}
          onSubmitReply={onSubmitReply}
          onDelete={onDelete}
          onToggleCollapse={onToggleCollapse}
        />
      ))}
    </ol>
  );
}
