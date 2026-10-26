import FileIcon from "./FileIcon";

const escapeRegExp = (s) => s.replaceAll(/[.*+?^${}()|[\]\\]/, "\\$&");

function highlightText(text, match) {
  if (match.trim().length === 0) {
    return text;
  }

  const safe = escapeRegExp(match);
  const re = new RegExp(`(${safe})`, "gi");
  const matches = text.split(re);

  return matches.map((part, i) => {
    return part.toLowerCase() === match.toLowerCase() ? (
      <span key={i} className="highlight">
        {part}
      </span>
    ) : (
      part
    );
  });
}

export default function FileTree({
  files,
  selectedId,
  expandedFolders,
  onSelect,
  onToggleFolder,
  query,

  level = 1,
  isRoot = true,
}) {
  const isQuery = query.trim().length > 0;

  return (
    <ul role={isRoot ? "tree" : "group"} aria-label="file explorer">
      {files.map((file) => {
        const isFolder = file.type === "folder";
        const hasChildren =
          isFolder && file.children && file.children.length > 0;
        const isSelected = file.id === selectedId;
        const isExpanded =
          isFolder && (isQuery || expandedFolders.has(file.id));
        const highlightName = highlightText(file.name, query);

        const onToggle = (e) => {
          e.stopPropagation();
          onToggleFolder(file.id);
        };
        const onSelectFile = () => {
          if (isFolder && !isExpanded) {
            onToggleFolder(file.id);
          }

          onSelect(file.id);
        };

        return (
          <li key={file.id}>
            <div
              className={isSelected ? "file selected" : "file"}
              role="treeitem"
              tabIndex={0}
              aria-selected={isSelected}
              aria-level={level}
              aria-expanded={isFolder ? isExpanded : undefined}
              onClick={onSelectFile}
              onKeyDown={() => {}}
            >
              <FileIcon
                isFolder={isFolder}
                hasChildren={hasChildren}
                isExpanded={isExpanded}
                onToggleFolder={onToggle}
              />
              <span
                aria-label={`${file.name}, ${isFolder ? "folder" : "file"}`}
              >
                {highlightName}
              </span>
            </div>
            {hasChildren && isExpanded ? (
              <FileTree
                files={file.children}
                selectedId={selectedId}
                expandedFolders={expandedFolders}
                onSelect={onSelect}
                onToggleFolder={onToggleFolder}
                isRoot={false}
                level={level + 1}
                query={query}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
