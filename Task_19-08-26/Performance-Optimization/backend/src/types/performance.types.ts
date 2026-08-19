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

export interface PerformanceMetricInput {
  metric: PerformanceMetric;
  value: number;
  rating: PerformanceRating;
  page: string;
  device?: string;
  connection?: string;
  userAgent?: string;
}

export interface PerformanceMetricResponse {
  id: string;
  metric: PerformanceMetric;
  value: number;
  rating: PerformanceRating;
  page: string;
  device: string | null;
  connection: string | null;
  userAgent: string | null;
  createdAt: Date;
}