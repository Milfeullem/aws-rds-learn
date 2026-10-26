import type { KeyboardEvent } from "react";
import type { FileId } from "../types";
import type { VisibleNode } from "../utils/flattenVisibleNodes";
import FileIcon from "./FileIcon";

type FileTreeProps = {
  nodes: VisibleNode[];
  selectedId: FileId | null;
  focusedId: FileId | null;
  itemHeight: number;
  offsetY: number;
  totalHeight: number;
  start: number;
  end: number;
  onToggleFolder: (id: FileId) => void;
  onSelect: (id: FileId) => void;
  onItemKeyDown: (id: FileId, event: KeyboardEvent<HTMLElement>) => void;
  registerItemRef: (id: FileId, el: HTMLElement | null) => void;
};

export default function FileTree({
  nodes,
  selectedId,
  focusedId,
  itemHeight,
  offsetY,
  totalHeight,
  start,
  end,
  onToggleFolder,
  onSelect,
  onItemKeyDown,
  registerItemRef,
}: FileTreeProps) {
  const slice = start <= end ? nodes.slice(start, end + 1) : [];

  return (
    <div
      className="file-tree"
      role="tree"
      aria-label="File explorer"
      style={{ height: totalHeight, position: "relative" }}
    >
      <div
        className="file-tree-window"
        style={{ transform: `translateY(${offsetY}px)` }}
      >
        {slice.map((node, i) => {
          const index = start + i;
          const isFolder = node.type === "folder";
          const isSelected = selectedId === node.id;
          const isFocused = focusedId === node.id;
          const isTabStop =
            isFocused ||
            (focusedId == null && index === 0);

          const handleSelect = () => {
            onSelect(node.id);
            if (node.hasChildren && !node.isExpanded) {
              onToggleFolder(node.id);
            }
          };

          return (
            <div
              key={node.id}
              ref={(el) => registerItemRef(node.id, el)}
              className={isSelected ? "file-item selected" : "file-item"}
              role="treeitem"
              tabIndex={isTabStop ? 0 : -1}
              aria-selected={isSelected}
              aria-expanded={node.hasChildren ? node.isExpanded : undefined}
              aria-level={node.level}
              style={{
                height: itemHeight,
                paddingLeft: (node.level - 1) * 16,
              }}
              onClick={handleSelect}
              onKeyDown={(event) => onItemKeyDown(node.id, event)}
            >
              <FileIcon
                id={node.id}
                isFolder={isFolder}
                hasChildren={node.hasChildren}
                isExpanded={node.isExpanded}
                onToggle={onToggleFolder}
              />
              <span>{node.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
