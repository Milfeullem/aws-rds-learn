import { useEffect, useState } from "react";

export default function useDebouncedValue(value, delay) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVal(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return val;
}
