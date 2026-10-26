export type Slide = {
  id: string;
  title: string;
  caption: string;
  /** Solid color placeholder — swap for <img> in a real app */
  tone: string;
};

export type CarouselProps = {
  slides: Slide[];
  /** Auto-advance interval in ms; 0 / undefined = off */
  autoPlayMs?: number;
  /** Loop from last → first (and first → last). Default true. */
  loop?: boolean;
  /** Announce slide changes to screen readers. Default "polite". */
  live?: "off" | "polite" | "assertive";
  label?: string;
};
