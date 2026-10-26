export default function FileIcon({
  isFolder,
  hasChildren,
  isExpanded,
  onToggleFolder,
}) {
  if (!isFolder) {
    return <span aria-hidden="true">*</span>;
  }

  if (isFolder && !hasChildren) {
    return <span aria-hidden="true">·</span>;
  }

  return (
    <button
      aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
      onClick={onToggleFolder}
    >
      {isExpanded ? "-" : "+"}
    </button>
  );
}
