import { useEffect, useState } from "react";

type UseFetchState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

type UseFetchOptions = RequestInit & {
  /** Skip the request when false (e.g. wait for an id). Default true. */
  enabled?: boolean;
};

/**
 * Minimal data-fetching hook with loading / error / abort.
 *
 * Interview tips:
 * - AbortController cancels in-flight work on url change or unmount (race safety).
 * - Ignore `AbortError` — it is expected cleanup, not a user-facing failure.
 * - Reset state when `url` / `enabled` changes so UI does not flash stale data.
 * - Keep options identity stable from the caller, or only depend on `url` + serializable bits.
 */
export function useFetch<T = unknown>(
  url: string | null,
  options: UseFetchOptions = {},
): UseFetchState<T> {
  const { enabled = true, ...init } = options;
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    loading: Boolean(enabled && url),
  });

  useEffect(() => {
    if (!enabled || !url) {
      setState({ data: null, error: null, loading: false });
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetch(url, { ...init, signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return (await res.json()) as T;
      })
      .then((data) => {
        if (!cancelled) {
          setState({ data, error: null, loading: false });
        }
      })
      .catch((err: unknown) => {
        if (cancelled || (err instanceof DOMException && err.name === "AbortError")) {
          return;
        }
        setState({
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
          loading: false,
        });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
    // Intentionally key off url + enabled; callers should memoize body/headers if needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled]);

  return state;
}
