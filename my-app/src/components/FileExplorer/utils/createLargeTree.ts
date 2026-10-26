import type { FileNode } from "../types";

/** Builds a deep/wide demo tree for virtualization stress testing. */
export function createLargeTree(
  folderCount = 40,
  filesPerFolder = 30,
): FileNode[] {
  let nextId = 1;

  const folders: FileNode[] = Array.from({ length: folderCount }, (_, i) => {
    const folderId = nextId++;
    return {
      id: folderId,
      name: `folder-${i}`,
      type: "folder" as const,
      children: Array.from({ length: filesPerFolder }, (_, j) => ({
        id: nextId++,
        name: `file-${i}-${j}.ts`,
        type: "file" as const,
      })),
    };
  });

  return [
    {
      id: nextId++,
      name: "project",
      type: "folder",
      children: folders,
    },
    { id: nextId++, name: "README.md", type: "file" },
  ];
}
