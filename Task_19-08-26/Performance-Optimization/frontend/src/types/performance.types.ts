export type PerformanceMetric =
  | "LCP"
  | "INP"
  | "CLS"
  | "FCP"
  | "TTFB";

export type PerformanceRating =
  | "good"
  | "needs-improvement"
  | "poor";

export interface PerformanceMetricPayload {
  metric: PerformanceMetric;
  value: number;
  rating: PerformanceRating;
  page: string;
  device?: string;
  connection?: string;
  userAgent?: string;
}