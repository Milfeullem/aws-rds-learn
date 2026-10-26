import { useId, useState } from "react";

export default function StarRating({ max = 5 }) {
  const [selectedStar, setSelectedStar] = useState(-1);
  const [hoverStar, setHoverStar] = useState(-1);

  const baseId = useId();
  const statusId = `${baseId}-statusId`;

  const onSelect = (index) => {
    setSelectedStar((pre) => {
      return pre === index ? -1 : index;
    });
  };

  const onMouseEnter = (index) => {
    setHoverStar(index);
  };

  const onMouseLeave = () => {
    setHoverStar(-1);
  };

  return (
    <div className="star-rating">
      <div
        role="optgroup"
        className="star-list"
        aria-describedby={statusId}
        onMouseLeave={onMouseLeave}
        aria-label="Rating"
      >
        {Array.from({ length: max }).map((_, i) => {
          const isSelected = selectedStar >= 0 && i <= selectedStar;
          const isHovered = hoverStar >= 0 && i <= hoverStar;

          return (
            <button
              className={isHovered ? "hover" : isSelected ? "selected" : ""}
              aria-label={`Rate ${i + 1} out of ${max} star(s)`}
              aria-pressed={i === selectedStar}
              key={i}
              onClick={() => onSelect(i)}
              onMouseEnter={() => onMouseEnter(i)}
            >
              *
            </button>
          );
        })}
      </div>
      <output id={statusId}>
        {selectedStar < 0
          ? "Not rated"
          : `Rating: ${selectedStar + 1} / ${max}`}
      </output>
    </div>
  );
}
