export const markPerformance = (
  name: string
): void => {
  if (
    typeof performance === "undefined"
  ) {
    return;
  }

  performance.mark(name);
};

export const measurePerformance = (
  name: string,
  startMark: string,
  endMark: string
): number | null => {
  if (
    typeof performance === "undefined"
  ) {
    return null;
  }

  try {
    const measure =
      performance.measure(
        name,
        startMark,
        endMark
      );

    return measure.duration;
  } catch {
    return null;
  }
};