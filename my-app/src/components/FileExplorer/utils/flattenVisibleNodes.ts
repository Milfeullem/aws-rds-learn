import type { FileId, FileNode } from "../types";

export type VisibleNode = {
  id: FileId;
  name: string;
  type: "file" | "folder";
  parentId: FileId | null;
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
};

/** Depth-first list of currently visible tree rows (respects expanded folders). */
export function flattenVisibleNodes(
  nodes: FileNode[],
  expandedFolders: Set<FileId>,
  parentId: FileId | null = null,
  level = 1,
): VisibleNode[] {
  const result: VisibleNode[] = [];

  for (const node of nodes) {
    const hasChildren = Boolean(
      node.type === "folder" && node.children && node.children.length > 0,
    );
    const isExpanded = expandedFolders.has(node.id);

    result.push({
      id: node.id,
      name: node.name,
      type: node.type,
      parentId,
      level,
      hasChildren,
      isExpanded,
    });

    if (hasChildren && isExpanded && node.children) {
      result.push(
        ...flattenVisibleNodes(
          node.children,
          expandedFolders,
          node.id,
          level + 1,
        ),
      );
    }
  }

  return result;
}
