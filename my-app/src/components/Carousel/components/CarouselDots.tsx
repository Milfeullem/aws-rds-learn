import type { Slide } from "../types";

type Props = {
  slides: Slide[];
  index: number;
  onSelect: (index: number) => void;
  labelId: string;
};

export default function CarouselDots({
  slides,
  index,
  onSelect,
  labelId,
}: Props) {
  return (
    <div
      className="carousel__dots"
      role="tablist"
      aria-labelledby={labelId}
    >
      {slides.map((slide, i) => {
        const selected = i === index;
        return (
          <button
            key={slide.id}
            type="button"
            role="tab"
            className={
              selected ? "carousel__dot carousel__dot--active" : "carousel__dot"
            }
            aria-selected={selected}
            aria-label={`Go to slide ${i + 1}: ${slide.title}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(i)}
          />
        );
      })}
    </div>
  );
}
