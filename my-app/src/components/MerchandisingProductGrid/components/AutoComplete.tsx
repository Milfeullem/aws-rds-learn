import { useEffect, useId, useRef, useState } from "react";
import clsx from "../../ProductPurchase/utils/clsx";

const visuallyHiddenStyle: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

type AutocompleteProps = {
  options: string[];
  onSelect?: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
};

export default function Autocomplete({
  options,
  onSelect,
  placeholder,
  label,
  id,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const reactId = useId();
  const baseId = id ?? `autocomplete-${reactId}`;
  const listboxId = `${baseId}-listbox`;
  const labelId = `${baseId}-label`;
  const statusId = `${baseId}-status`;

  const matchesQuery = (option: string, query: string) =>
    option.toLowerCase().includes(query.toLowerCase());

  const filteredOptions = options.filter((option) =>
    matchesQuery(option, inputValue),
  );

  const activeOptionId =
    isOpen && focusedIndex >= 0 && focusedIndex < filteredOptions.length
      ? `${baseId}-option-${focusedIndex}`
      : undefined;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0) {
      optionRefs.current[focusedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  const closeList = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && !isOpen) {
      e.preventDefault();
      setIsOpen(filteredOptions.length > 0 || inputValue.length > 0);
      setFocusedIndex(filteredOptions.length > 0 ? 0 : -1);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      closeList();
      inputRef.current?.focus();
      return;
    }

    if (!isOpen || filteredOptions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1,
        );
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(filteredOptions.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case "Tab":
        closeList();
        break;
    }
  };

  const handleSelect = (value: string) => {
    setInputValue(value);
    setIsOpen(false);
    setFocusedIndex(-1);
    onSelect?.(value);
    inputRef.current?.focus();
  };

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const nextMatches = options.filter((option) => matchesQuery(option, value));
    setInputValue(value);
    setIsOpen(value.length > 0);
    setFocusedIndex(nextMatches.length > 0 ? 0 : -1);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp("(" + query + ")", "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div ref={containerRef} className="autocomplete-container">
      {label ? (
        <label id={labelId} htmlFor={baseId}>
          {label}
        </label>
      ) : null}
      <input
        ref={inputRef}
        id={baseId}
        type="text"
        role="combobox"
        className="autocomplete-input"
        value={inputValue}
        placeholder={placeholder}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={activeOptionId}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : placeholder || "Search suggestions"}
        aria-describedby={statusId}
        onChange={onQueryChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (inputValue.length > 0) setIsOpen(true);
        }}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          id={listboxId}
          className="autocomplete-dropdown"
          role="listbox"
          aria-label={label || placeholder || "Suggestions"}
        >
          {filteredOptions.map((option, index) => {
            const selected = focusedIndex === index;
            return (
              <li
                key={option}
                id={`${baseId}-option-${index}`}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-label={option}
                aria-selected={selected}
                className={clsx(
                  "autocomplete-option",
                  selected ? "focused" : "",
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelect(option);
                  }
                }}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {highlightText(option, inputValue)}
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && filteredOptions.length === 0 && (
        <output className="autocomplete-empty">No options found</output>
      )}
    </div>
  );
}
