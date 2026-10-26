/**
 * Carousel — practice skeleton
 *
 * Goal (30–45 min):
 * 1. index state → track translateX(-index * 100%)
 * 2. next / prev / goTo（支持 loop 与非 loop）
 * 3. dots + controls 绑定同一套导航
 * 4. useAutoPlay：pause on hover/focus；visibilitychange；clearInterval
 * 5. 键盘 ← →；prefers-reduced-motion 关掉自动播放与过渡
 * 6. a11y：region / roledescription / aria-hidden / aria-live
 *
 * Wire in src/App.tsx:
 *   import App from './components/Carousel/App'
 *
 * Self-check: open App.solution.tsx after you finish.
 * 面试话术: 见同目录 面试话术.md
 */
import "./styles.css";

import Carousel from "./components/Carousel";
import { demoSlides } from "./data";

export default function App() {
  return (
    <main className="app">
      <section className="hero" aria-labelledby="carousel-title">
        <p className="eyebrow">Premium React Case</p>
        <h1 id="carousel-title">Image Carousel</h1>
        <p>
          Single index as source of truth · autoplay with pause · keyboard +
          a11y. Hover the stage to pause.
        </p>
      </section>

      {/* TODO: try autoPlayMs={0} / loop={false} as interviewer follow-ups */}
      <Carousel slides={demoSlides} autoPlayMs={4000} loop />
    </main>
  );
}
