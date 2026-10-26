/**
 * Carousel — practice skeleton (fill the TODOs)
 *
 * Core model:
 *   index ∈ [0, n)
 *   track style: transform: translateX(-index * 100%)
 *
 * Must-haves interviewers poke:
 * 1. next / prev / goTo + optional loop
 * 2. autoplay pause reasons (hover / focus / page hidden) — prefer separate flags
 * 3. keyboard ← → when region focused
 * 4. a11y: region + roledescription, aria-hidden on inactive slides
 * 5. timer cleanup; respect prefers-reduced-motion
 */
import {
  useCallback,
  useEffect,
  useId,
  useState,
  type KeyboardEvent,
} from "react";
import type { CarouselProps } from "../types";
import { useAutoPlay } from "../hooks/useAutoPlay";
import CarouselControls from "./CarouselControls";
import CarouselDots from "./CarouselDots";

export default function Carousel({
  slides,
  autoPlayMs = 4000,
  loop = true,
  live = "polite",
  label = "Featured slides",
}: CarouselProps) {
  const labelId = useId();
  const [index, setIndex] = useState(0);

  // TODO(interview): split pause reasons — one boolean fights hover vs visibility
  const [userPaused, setUserPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const count = slides.length;

  // TODO(interview): clamp index when slides.length shrinks
  useEffect(() => {
    // if (count === 0) return;
    // setIndex((i) => Math.min(i, count - 1));
  }, [count]);

  // TODO(interview): matchMedia("(prefers-reduced-motion: reduce)")
  useEffect(() => {
    // const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // …
    void setReduceMotion;
  }, []);

  /**
   * TODO(interview): implement goTo / next / prev
   * - loop: ((i % n) + n) % n
   * - no loop: clamp to [0, n-1]
   * Talk track: "index is the single source of truth; UI is derived."
   */
  const goTo = useCallback(
    (_next: number) => {
      void _next;
      void setIndex;
      // YOUR CODE HERE
    },
    [count, loop],
  );

  const next = useCallback(() => {
    // Prefer setIndex(i => …) so autoplay never closes over a stale index
    void goTo;
  }, [goTo]);

  const prev = useCallback(() => {
    void goTo;
  }, [goTo]);

  // TODO: Page Visibility → setPageHidden(document.hidden)
  useEffect(() => {
    // document.addEventListener("visibilitychange", …)
    void setPageHidden;
  }, []);

  const autoPlayEnabled =
    autoPlayMs > 0 &&
    count > 1 &&
    !userPaused &&
    !pageHidden &&
    !reduceMotion;

  useAutoPlay({
    enabled: autoPlayEnabled,
    intervalMs: autoPlayMs,
    onTick: next,
  });

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // TODO: ArrowLeft → prev; ArrowRight → next; preventDefault when handled
    void event;
    void prev;
    void next;
  };

  if (count === 0) {
    return <p className="carousel__empty">No slides.</p>;
  }

  const atStart = index === 0;
  const atEnd = index === count - 1;

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      // TODO: tabIndex={0} so Arrow keys work when region is focused
      onKeyDown={onKeyDown}
      onMouseEnter={() => setUserPaused(true)}
      onMouseLeave={() => setUserPaused(false)}
      onFocusCapture={() => setUserPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setUserPaused(false);
        }
      }}
    >
      <h2 id={labelId} className="sr-only">
        {label}
      </h2>

      <div className="carousel__viewport">
        <ul
          className="carousel__track"
          // TODO: style={{ transform: `translateX(-${index * 100}%)` }}
          style={undefined}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <li
                key={slide.id}
                className="carousel__slide"
                aria-hidden={!active}
                style={{ background: slide.tone }}
              >
                <div className="carousel__slide-inner">
                  <p className="carousel__eyebrow">
                    Slide {i + 1} / {count}
                  </p>
                  <h3>{slide.title}</h3>
                  <p>{slide.caption}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sr-only" aria-live={live} aria-atomic="true">
        {slides[index]?.title}
      </div>

      <CarouselControls
        onPrev={prev}
        onNext={next}
        prevDisabled={!loop && atStart}
        nextDisabled={!loop && atEnd}
      />

      <CarouselDots
        slides={slides}
        index={index}
        onSelect={goTo}
        labelId={labelId}
      />
    </div>
  );
}
