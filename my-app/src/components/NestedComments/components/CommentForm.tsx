import { useId, useState, type FormEvent } from "react";
import type { CommentDraft } from "../types";

export default function CommentForm({
  submitLabel = "Post",
  initialAuthor = "",
  onSubmit,
  onCancel,
  autoFocus = false,
}: {
  submitLabel?: string;
  initialAuthor?: string;
  onSubmit: (draft: CommentDraft) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const baseId = useId();
  const authorId = `${baseId}-author`;
  const bodyId = `${baseId}-body`;

  const [author, setAuthor] = useState(initialAuthor);
  const [body, setBody] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextAuthor = author.trim();
    const nextBody = body.trim();

    if (!nextAuthor || !nextBody) {
      return;
    }

    onSubmit({ author: nextAuthor, body: nextBody });
    setBody("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <label htmlFor={authorId}>
        Name
        <input
          id={authorId}
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          autoComplete="nickname"
          required
        />
      </label>
      <label htmlFor={bodyId}>
        Comment
        <textarea
          id={bodyId}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={3}
          required
          autoFocus={autoFocus}
        />
      </label>
      <div className="comment-form__actions">
        <button type="submit">{submitLabel}</button>
        {onCancel ? (
          <button type="button" className="ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
