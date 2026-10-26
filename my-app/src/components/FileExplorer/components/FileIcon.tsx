import type { FileId } from "../types";
import type { MouseEvent } from "react";

type FileIconProps = {
  id: FileId;
  isFolder: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: (id: FileId) => void;
};

export default function FileIcon({
  isFolder,
  hasChildren,
  isExpanded,
  id,
  onToggle,
}: FileIconProps) {
  if (!isFolder) {
    return <span aria-hidden="true">*</span>;
  }

  // Empty folders: show a static marker, no expand control
  if (!hasChildren) {
    return <span aria-hidden="true">·</span>;
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Keep row click from also selecting/expanding via the treeitem handler
    event.stopPropagation();
    onToggle(id);
  };

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
      // Prevent button from stealing focus from the treeitem (roving tabindex)
      onMouseDown={(event) => event.preventDefault()}
      onClick={handleClick}
    >
      {isExpanded ? "-" : "+"}
    </button>
  );
}
