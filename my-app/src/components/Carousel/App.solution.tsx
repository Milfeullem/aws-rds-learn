/**
 * Reference solution — compare after you finish the skeleton.
 * To run: in src/App.tsx
 *   import App from './components/Carousel/App.solution'
 */
import "./styles.css";

import Carousel from "./components/Carousel.solution";
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

      <Carousel slides={demoSlides} autoPlayMs={4000} loop />
    </main>
  );
}
