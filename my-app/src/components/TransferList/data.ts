import type { TransferItem } from "./types";

/** Seed: most items start on the left (Available). */
export const initialLeft: TransferItem[] = [
  { id: "react", label: "React" },
  { id: "typescript", label: "TypeScript" },
  { id: "vite", label: "Vite" },
  { id: "testing-library", label: "Testing Library" },
  { id: "playwright", label: "Playwright" },
  { id: "zustand", label: "Zustand" },
  { id: "tanstack-query", label: "TanStack Query" },
  { id: "css-modules", label: "CSS Modules" },
];

export const initialRight: TransferItem[] = [
  { id: "accessibility", label: "Accessibility" },
  { id: "performance", label: "Performance" },
];
