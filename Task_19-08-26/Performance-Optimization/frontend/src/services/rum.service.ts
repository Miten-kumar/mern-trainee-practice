import apiClient from "../api/apiClient";

import type {
  PerformanceMetricPayload,
} from "../types/performance.types";

export const sendPerformanceMetric = async (
  metric: PerformanceMetricPayload
): Promise<void> => {
  try {
    await apiClient.post(
      "/performance/rum",
      metric
    );
  } catch (error) {
    /**
     * RUM must never affect the user experience.
     *
     * If the monitoring API fails,
     * the application should continue working.
     */
    console.error(
      "Failed to send performance metric",
      error
    );
  }
};