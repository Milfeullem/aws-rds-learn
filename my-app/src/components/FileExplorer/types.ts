export type FileId = number | string;

export type FileNode = {
  id: FileId;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};
