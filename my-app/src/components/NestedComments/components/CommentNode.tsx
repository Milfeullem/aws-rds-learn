import type { Comment, CommentDraft, CommentId } from "../types";
import CommentForm from "./CommentForm";

/**
 * Recursive presentational node.
 * Parent owns tree mutations + which id is actively replying / collapsed.
 */
export default function CommentNode({
  comment,
  depth,
  isReplying,
  isCollapsed,
  replyTargetId,
  collapsedIds,
  onReply,
  onCancelReply,
  onSubmitReply,
  onDelete,
  onToggleCollapse,
}: {
  comment: Comment;
  depth: number;
  isReplying: boolean;
  isCollapsed: boolean;
  replyTargetId: CommentId | null;
  collapsedIds: Set<CommentId>;
  onReply: (id: CommentId) => void;
  onCancelReply: () => void;
  onSubmitReply: (parentId: CommentId, draft: CommentDraft) => void;
  onDelete: (id: CommentId) => void;
  onToggleCollapse: (id: CommentId) => void;
}) {
  const childCount = comment.children.length;
  const showChildren = childCount > 0 && !isCollapsed;

  return (
    <li className="comment-node" style={{ ["--depth" as string]: depth }}>
      <article className="comment-card" aria-labelledby={`comment-${comment.id}-author`}>
        <header className="comment-card__meta">
          <strong id={`comment-${comment.id}-author`}>{comment.author}</strong>
          <time dateTime={new Date(comment.createdAt).toISOString()}>
            {new Date(comment.createdAt).toLocaleString()}
          </time>
        </header>
        <p className="comment-card__body">{comment.body}</p>
        <div className="comment-card__actions">
          <button type="button" onClick={() => onReply(comment.id)}>
            Reply
          </button>
          {childCount > 0 ? (
            <button
              type="button"
              aria-expanded={!isCollapsed}
              onClick={() => onToggleCollapse(comment.id)}
            >
              {isCollapsed ? `Show ${childCount}` : "Hide replies"}
            </button>
          ) : null}
          <button
            type="button"
            className="danger"
            onClick={() => onDelete(comment.id)}
          >
            Delete
          </button>
        </div>

        {isReplying ? (
          <CommentForm
            submitLabel="Reply"
            autoFocus
            onCancel={onCancelReply}
            onSubmit={(draft) => onSubmitReply(comment.id, draft)}
          />
        ) : null}
      </article>

      {showChildren ? (
        <ol className="comment-children">
          {comment.children.map((child) => (
            <CommentNode
              key={child.id}
              comment={child}
              depth={depth + 1}
              isReplying={replyTargetId === child.id}
              isCollapsed={collapsedIds.has(child.id)}
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
      ) : null}
    </li>
  );
}
