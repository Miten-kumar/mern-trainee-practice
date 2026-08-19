import { onLCP,onINP,onCLS,onFCP,onTTFB } from "web-vitals";
import { sendPerformanceMetric } from "../services/rum.service";
import { getDeviceType } from "./device";
import type { PerformanceMetric,PerformanceRating } from "../types/performance.types";


interface NetworkInformation {
  effectiveType?: string;
}

interface NavigatorWithConnection
  extends Navigator {
  connection?: NetworkInformation;
}

const getConnectionType = (): string | undefined => {
  const navigatorWithConnection =
    navigator as NavigatorWithConnection;

  return (
    navigatorWithConnection
      .connection
      ?.effectiveType
  );
};

const sendMetric = (
  metric: PerformanceMetric,
  value: number,
  rating: PerformanceRating
): void => {
  const connection =
    getConnectionType();

  void sendPerformanceMetric({
    metric,
    value,
    rating,
    page: window.location.pathname,
    device: getDeviceType(),
    connection,
    userAgent: navigator.userAgent,
  });
};

export const initializeWebVitals = (): void => {
  onLCP((metric) => {
    sendMetric(
      "LCP",
      metric.value,
      metric.rating
    );
  });

  onINP((metric) => {
    sendMetric(
      "INP",
      metric.value,
      metric.rating
    );
  });

  onCLS((metric) => {
    sendMetric(
      "CLS",
      metric.value,
      metric.rating
    );
  });

  onFCP((metric) => {
    sendMetric(
      "FCP",
      metric.value,
      metric.rating
    );
  });

  onTTFB((metric) => {
    sendMetric(
      "TTFB",
      metric.value,
      metric.rating
    );
  });
};