import type { FileNode } from "./type";

export const exampleData: FileNode[] = [
  {
    id: 1,
    name: "src",
    type: "folder",
    children: [
      {
        id: 2,
        name: "components",
        type: "folder",
        children: [
          { id: 3, name: "Button.tsx", type: "file", size: 1024 },
          { id: 4, name: "Card.tsx", type: "file", size: 2048 },
        ],
      },
      { id: 5, name: "App.tsx", type: "file", size: 512 },
    ],
  },
  {
    id: 6,
    name: "package.json",
    type: "file",
    size: 256,
  },
];
