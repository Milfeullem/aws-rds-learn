import { useId, useMemo, useState } from "react";
import type { FileNode } from "../type";
import SearchInput from "./SearhInput";
import FileTree from "./FileTree";
import useDebouncedValue from "../useDebounce";

function filterFile(files: FileNode[], query): FileNode[] {
  const trimedQuery = query.trim().toLowerCase();

  if (trimedQuery.length === 0) {
    return files;
  }

  return files
    .map((node) => {
      const { name, type, children } = node;

      const isMatch = name.toLowerCase().includes(trimedQuery);

      if (isMatch) {
        return { ...node };
      }

      const matchedChildren =
        type === "folder" ? filterFile(children ?? [], trimedQuery) : [];

      if (matchedChildren.length > 0) {
        return { ...node, children: matchedChildren };
      }

      return null;
    })
    .filter((node) => node != null);
}

export default function SearchFileExplorer({ files }: { files: FileNode[] }) {
  const [selectedId, setSelectedId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [query, setQuery] = useState("");

  const delayQuery = useDebouncedValue(query, 300);
  const baseId = useId();
  const inputId = `${baseId}-search`;

  const filteredData = useMemo(() => {
    return filterFile(files, delayQuery);
  }, [delayQuery, files]);

  const onToggleFolder = (id) => {
    setExpandedFolders((pre) => {
      const next = new Set(pre);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const onSelectFile = (id) => {
    setSelectedId(id);
  };

  return (
    <div className="search-file-explorer">
      <SearchInput id={inputId} query={query} onChange={setQuery} />
      <FileTree
        query={delayQuery}
        files={filteredData}
        selectedId={selectedId}
        expandedFolders={expandedFolders}
        onSelect={onSelectFile}
        onToggleFolder={onToggleFolder}
      />
    </div>
  );
}
