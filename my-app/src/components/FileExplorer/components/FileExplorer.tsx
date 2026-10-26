import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useControllableState } from "../hooks/useControllableState";
import { useVirtualWindow } from "../hooks/useVirtualWindow";
import type { FileId, FileNode } from "../types";
import { flattenVisibleNodes } from "../utils/flattenVisibleNodes";
import FileTree from "./FileTree";

export type FileExplorerProps = {
  files: FileNode[];
  /** Controlled selection */
  selectedId?: FileId | null;
  defaultSelectedId?: FileId | null;
  onSelect?: (id: FileId | null) => void;
  /** Controlled expanded folder ids */
  expandedIds?: FileId[];
  defaultExpandedIds?: FileId[];
  onExpandedChange?: (ids: FileId[]) => void;
  /** Virtual list viewport */
  height?: number;
  itemHeight?: number;
  overscan?: number;
};

export default function FileExplorer({
  files,
  selectedId: selectedIdProp,
  defaultSelectedId = null,
  onSelect: onSelectProp,
  expandedIds: expandedIdsProp,
  defaultExpandedIds = [],
  onExpandedChange,
  height = 320,
  itemHeight = 28,
  overscan = 5,
}: FileExplorerProps) {
  const [selectedId, setSelectedId] = useControllableState<FileId | null>({
    value: selectedIdProp,
    defaultValue: defaultSelectedId,
    onChange: onSelectProp,
  });

  const [expandedIds, setExpandedIds] = useControllableState<FileId[]>({
    value: expandedIdsProp,
    defaultValue: defaultExpandedIds,
    onChange: onExpandedChange,
  });

  const [focusedId, setFocusedId] = useState<FileId | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<FileId, HTMLElement>());

  const expandedFolders = useMemo(() => new Set(expandedIds), [expandedIds]);

  const visibleNodes = useMemo(
    () => flattenVisibleNodes(files, expandedFolders),
    [files, expandedFolders],
  );

  const { start, end, offsetY, totalHeight } = useVirtualWindow({
    containerRef,
    itemCount: visibleNodes.length,
    itemHeight,
    overscan,
  });

  const registerItemRef = (id: FileId, el: HTMLElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  };

  const onToggleFolder = (id: FileId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return [...next];
    });
  };

  const scrollItemIntoView = (index: number) => {
    const el = containerRef.current;
    if (!el || index < 0) return;

    const top = index * itemHeight;
    const bottom = top + itemHeight;
    const { scrollTop, clientHeight } = el;

    if (top < scrollTop) {
      el.scrollTop = top;
    } else if (bottom > scrollTop + clientHeight) {
      el.scrollTop = bottom - clientHeight;
    }
  };

  const moveFocus = (id: FileId) => {
    setFocusedId(id);
    setSelectedId(id);
  };

  // Collapse can hide the focused row — fall back
  useEffect(() => {
    if (focusedId == null) return;
    if (visibleNodes.some((node) => node.id === focusedId)) return;

    const fallback =
      (selectedId != null &&
        visibleNodes.some((node) => node.id === selectedId) &&
        selectedId) ||
      visibleNodes[0]?.id ||
      null;

    setFocusedId(fallback);
  }, [visibleNodes, focusedId, selectedId]);

  // Scroll into view + DOM focus after focusedId / window changes
  useEffect(() => {
    if (focusedId == null) return;

    const index = visibleNodes.findIndex((node) => node.id === focusedId);
    if (index < 0) return;

    scrollItemIntoView(index);

    // Wait a frame so the virtual window mounts the target row
    const raf = requestAnimationFrame(() => {
      itemRefs.current.get(focusedId)?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [focusedId, visibleNodes, itemHeight]);

  const onSelect = (id: FileId) => {
    setSelectedId(id);
    setFocusedId(id);
  };

  const onItemKeyDown = (id: FileId, event: KeyboardEvent<HTMLElement>) => {
    const index = visibleNodes.findIndex((node) => node.id === id);
    if (index < 0) return;

    const current = visibleNodes[index];

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = visibleNodes[index + 1];
        if (next) moveFocus(next.id);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prev = visibleNodes[index - 1];
        if (prev) moveFocus(prev.id);
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        if (current.hasChildren && !current.isExpanded) {
          onToggleFolder(current.id);
        } else if (current.hasChildren && current.isExpanded) {
          const child = visibleNodes[index + 1];
          if (child?.parentId === current.id) moveFocus(child.id);
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (current.hasChildren && current.isExpanded) {
          onToggleFolder(current.id);
        } else if (current.parentId != null) {
          moveFocus(current.parentId);
        }
        break;
      }
      case "Home": {
        event.preventDefault();
        const first = visibleNodes[0];
        if (first) moveFocus(first.id);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = visibleNodes[visibleNodes.length - 1];
        if (last) moveFocus(last.id);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        setSelectedId(current.id);
        if (current.hasChildren && !current.isExpanded) {
          onToggleFolder(current.id);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      className="file-explorer"
      ref={containerRef}
      style={{ height, overflow: "auto" }}
    >
      <FileTree
        nodes={visibleNodes}
        selectedId={selectedId}
        focusedId={focusedId}
        itemHeight={itemHeight}
        offsetY={offsetY}
        totalHeight={totalHeight}
        start={start}
        end={end}
        onSelect={onSelect}
        onToggleFolder={onToggleFolder}
        onItemKeyDown={onItemKeyDown}
        registerItemRef={registerItemRef}
      />
    </div>
  );
}
