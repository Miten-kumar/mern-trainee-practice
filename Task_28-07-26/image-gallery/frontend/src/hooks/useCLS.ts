import { useEffect, useState } from 'react';

// CLS = sum of "layout shift" scores for any shift that wasn't caused
// by a recent user interaction (clicking, typing etc - those are
// expected to move things around, they don't count against the score)
export function useCLS() {
  const [cls, setCls] = useState(0);

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;

    let value = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          value += entry.value;
          setCls(value);
        }
      }
    });

    try {
      observer.observe({ type: 'layout-shift', buffered: true } as any);
    } catch {
      // layout-shift isn't supported in this browser, cls just stays 0
    }

    return () => observer.disconnect();
  }, []);

  return cls;
}
