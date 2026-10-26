export interface FileNode {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  size?: number; // File size in bytes (optional)
  modified?: string; // Last modified date (optional)
}

export interface FileExplorerProps {
  data: FileNode[];
}
