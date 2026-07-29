import { useEffect, useState } from 'react';

// returns a version of `value` that only updates after it stops
// changing for `delayMs`. Used so we don't fire an api call on every
// single keystroke.
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
