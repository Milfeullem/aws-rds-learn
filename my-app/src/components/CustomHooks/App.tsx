import { useState } from "react";
import {
  useFetch,
  useInterval,
  useLocalStorage,
  usePrevious,
  useThrottle,
} from "../../hooks";

type Todo = { id: number; title: string; completed: boolean };

export default function App() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);
  const prevCount = usePrevious(count);

  const [text, setText] = useState("");
  const throttledText = useThrottle(text, 500);

  const [theme, setTheme] = useLocalStorage<"light" | "dark">("demo-theme", "light");

  const [todoId, setTodoId] = useState(1);
  const { data, error, loading } = useFetch<Todo>(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
  );

  useInterval(() => setCount((c) => c + 1), running ? 1000 : null);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 640,
        margin: "2rem auto",
        padding: "0 1rem",
        display: "grid",
        gap: "1.5rem",
      }}
    >
      <h1>Custom Hooks Demo</h1>

      <section>
        <h2>useInterval + usePrevious</h2>
        <p>
          count: {count} (prev: {String(prevCount)})
        </p>
        <button type="button" onClick={() => setRunning((r) => !r)}>
          {running ? "Pause" : "Resume"}
        </button>
      </section>

      <section>
        <h2>useThrottle</h2>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type quickly…"
          style={{ width: "100%" }}
        />
        <p>raw: {text || "—"}</p>
        <p>throttled (500ms): {throttledText || "—"}</p>
      </section>

      <section>
        <h2>useLocalStorage</h2>
        <p>theme: {theme}</p>
        <button
          type="button"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        >
          Toggle theme
        </button>
      </section>

      <section>
        <h2>useFetch</h2>
        <label>
          todo id{" "}
          <input
            type="number"
            min={1}
            max={200}
            value={todoId}
            onChange={(e) => setTodoId(Number(e.target.value) || 1)}
          />
        </label>
        {loading && <p>Loading…</p>}
        {error && <p style={{ color: "crimson" }}>{error.message}</p>}
        {data && (
          <pre style={{ background: "#f4f4f5", padding: "0.75rem", overflow: "auto" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}
