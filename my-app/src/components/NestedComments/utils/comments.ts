import type { Comment, CommentId } from "../types";

export function createComment(
  author: string,
  body: string,
  id: CommentId = `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
): Comment {
  return {
    id,
    author: author.trim(),
    body: body.trim(),
    createdAt: Date.now(),
    children: [],
  };
}

/** Immutable insert: parentId === null → append at root. */
export function appendComment(
  tree: Comment[],
  parentId: CommentId | null,
  next: Comment,
): Comment[] {
  if (parentId === null) {
    return [...tree, next];
  }

  return tree.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...node.children, next] };
    }

    if (node.children.length === 0) {
      return node;
    }

    return {
      ...node,
      children: appendComment(node.children, parentId, next),
    };
  });
}

/** Delete node + its entire subtree. */
export function removeComment(tree: Comment[], id: CommentId): Comment[] {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: removeComment(node.children, id),
    }));
}

export function countComments(tree: Comment[]): number {
  return tree.reduce(
    (sum, node) => sum + 1 + countComments(node.children),
    0,
  );
}
