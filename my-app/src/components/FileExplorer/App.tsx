import { useMemo, useState } from "react";
import FileExplorer from "./components/FileExplorer";
import type { FileId, FileNode } from "./types";
import { createLargeTree } from "./utils/createLargeTree";
import "./style.css";

const smallData: FileNode[] = [
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
          { id: 3, name: "Button.tsx", type: "file" },
          { id: 4, name: "Card.tsx", type: "file" },
        ],
      },
      { id: 5, name: "App.tsx", type: "file" },
      { id: 7, name: "hooks", type: "folder", children: [] },
    ],
  },
  {
    id: 6,
    name: "package.json",
    type: "file",
  },
];

export default function App() {
  const largeData = useMemo(() => createLargeTree(40, 30), []);

  // Controlled mode demo
  const [selectedId, setSelectedId] = useState<FileId | null>(null);
  const [expandedIds, setExpandedIds] = useState<FileId[]>([]);
  const [useLarge, setUseLarge] = useState(true);

  const files = useLarge ? largeData : smallData;

  return (
    <main style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 8 }}>File Explorer</h2>
      <p style={{ marginTop: 0, fontSize: 14 }}>
        selected: {selectedId ?? "none"} · expanded: {expandedIds.length}
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={() => setUseLarge((v) => !v)}>
          {useLarge ? "Use small tree" : "Use large tree (~1200 rows)"}
        </button>
        <button type="button" onClick={() => setExpandedIds([])}>
          Collapse all
        </button>
      </div>
      <FileExplorer
        key={useLarge ? "large" : "small"}
        files={files}
        selectedId={selectedId}
        onSelect={setSelectedId}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        height={360}
        itemHeight={28}
      />
    </main>
  );
}
