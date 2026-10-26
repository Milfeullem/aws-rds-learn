import { useCallback, useEffect, useId, useRef, useState } from "react";
import "./styles.css";

import { useDebouncedValue } from "./hooks/useDebouncedValue";
import SearchBox from "./components/SearchBox";
import SearchStatus from "./components/SearchStatus";
import SearchResult from "./components/SearchResult";
import { mockSearchProducts } from "./mockApi";

export default function App() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const baseId = useId();
  const resultId = `${baseId}-result`;
  const searchId = `${baseId}-search`;

  const requestIdRef = useRef(0);
  const debouncedQuery = useDebouncedValue(query, 300);

  const fetchRequest = useCallback(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      requestIdRef.current += 1;
      setStatus("idle");
      setResult([]);
      setError(null);

      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const controller = new AbortController();

    controllerRef.current = controller;

    setStatus("loading");
    setResult([]);
    setError(null);

    mockSearchProducts(normalizedQuery, { signal: controller.signal })
      .then((nextResult) => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setResult(nextResult);
        setStatus(nextResult.length > 0 ? "success" : "empty");
      })
      .catch((error) => {
        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return;
        }

        setResult([]);
        setStatus("error");
        setError(
          error instanceof Error ? error.message : "Unknown search error.",
        );
      });
  }, [debouncedQuery]);

  const onRetry = () => {
    fetchRequest();
  };

  useEffect(() => {
    fetchRequest();

    return () => controllerRef.current?.abort();
  }, [fetchRequest]);

  return (
    <main className="app">
      <section className="placeholder-card" aria-labelledby="search-title">
        <p className="eyebrow">Premium React Case</p>
        <h1 id="search-title">Async Product Search</h1>
      </section>
      <SearchBox
        id={searchId}
        query={query}
        onChange={setQuery}
        outputId={resultId}
        status={status}
      />
      <SearchStatus status={status} onRetry={onRetry} error={error} />
      <SearchResult id={resultId} status={status} results={result} />
    </main>
  );
}
