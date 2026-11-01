import { useCallback, useEffect, useState } from "react";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Persist React state in `localStorage` (JSON).
 *
 * Interview tips:
 * - Lazy `useState` initializer avoids reading storage on every render.
 * - Wrap `JSON.parse` / `setItem` in try/catch (quota, private mode, bad JSON).
 * - Listen to `storage` to sync across tabs (same-origin).
 * - Functional updater keeps setter stable and avoids stale closures.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / private-mode failures
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== key) {
        return;
      }
      if (event.newValue == null) {
        setValue(initialValue);
        return;
      }
      try {
        setValue(JSON.parse(event.newValue) as T);
      } catch {
        // ignore malformed cross-tab writes
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initialValue]);

  const setStoredValue = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) =>
      typeof next === "function" ? (next as (prev: T) => T)(prev) : next,
    );
  }, []);

  return [value, setStoredValue];
}
