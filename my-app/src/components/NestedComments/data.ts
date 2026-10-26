import type { Comment } from "./types";

/** Seed tree — enough nesting to demo reply + collapse in an interview. */
export const initialComments: Comment[] = [
  {
    id: "c-1",
    author: "Ava",
    body: "Recursive rendering keeps the UI aligned with the tree. What’s the state shape?",
    createdAt: Date.UTC(2026, 9, 20, 8, 0),
    children: [
      {
        id: "c-1-1",
        author: "Ben",
        body: "I’d store a nested `children` array for the demo—updates are a bit harder, but rendering is obvious.",
        createdAt: Date.UTC(2026, 9, 20, 8, 12),
        children: [
          {
            id: "c-1-1-1",
            author: "Ava",
            body: "Agreed. Mention the flat `parentId` map as a follow-up for O(1) lookup.",
            createdAt: Date.UTC(2026, 9, 20, 8, 20),
            children: [],
          },
        ],
      },
      {
        id: "c-1-2",
        author: "Chris",
        body: "Don’t forget collapse state—store expanded ids in a Set at the root.",
        createdAt: Date.UTC(2026, 9, 20, 9, 5),
        children: [],
      },
    ],
  },
  {
    id: "c-2",
    author: "Dana",
    body: "Root-level thread. Reply should open a form under this node only.",
    createdAt: Date.UTC(2026, 9, 21, 10, 0),
    children: [],
  },
];
