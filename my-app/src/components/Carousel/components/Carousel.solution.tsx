/**
 * Reference Carousel — compare after you finish the skeleton.
 * Used by App.solution.tsx
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
  const [userPaused, setUserPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(
    () => typeof document !== "undefined" && document.hidden,
  );
  const [reduceMotion, setReduceMotion] = useState(false);

  const count = slides.length;

  useEffect(() => {
    if (count === 0) {
      return;
    }
    setIndex((i) => Math.min(i, count - 1));
  }, [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count === 0) {
        return;
      }

      if (loop) {
        setIndex(((nextIndex % count) + count) % count);
        return;
      }

      setIndex(Math.max(0, Math.min(nextIndex, count - 1)));
    },
    [count, loop],
  );

  const next = useCallback(() => {
    setIndex((i) => {
      if (count === 0) {
        return i;
      }
      if (loop) {
        return (i + 1) % count;
      }
      return Math.min(i + 1, count - 1);
    });
  }, [count, loop]);

  const prev = useCallback(() => {
    setIndex((i) => {
      if (count === 0) {
        return i;
      }
      if (loop) {
        return (i - 1 + count) % count;
      }
      return Math.max(i - 1, 0);
    });
  }, [count, loop]);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
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
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
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
      tabIndex={0}
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
          className={
            reduceMotion
              ? "carousel__track carousel__track--instant"
              : "carousel__track"
          }
          style={{ transform: `translateX(-${index * 100}%)` }}
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
