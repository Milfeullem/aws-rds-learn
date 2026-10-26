import type { Column } from "./types";

export const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      { id: "c-1", title: "Wire HTML5 drag events" },
      { id: "c-2", title: "Immutable moveCard helper" },
      { id: "c-3", title: "Drop indicator between cards" },
    ],
  },
  {
    id: "doing",
    title: "Doing",
    cards: [{ id: "c-4", title: "Interview talking points" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "c-5", title: "Scaffold columns + cards" }],
  },
];
