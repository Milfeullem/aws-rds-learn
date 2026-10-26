type Props = {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
};

export default function CarouselControls({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: Props) {
  return (
    <div className="carousel__controls">
      <button
        type="button"
        className="carousel__btn"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="carousel__btn"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next slide"
      >
        ›
      </button>
    </div>
  );
}
