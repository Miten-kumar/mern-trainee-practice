import { api } from "./client";

import type {
  ApiResponse,
  PerformanceMetric,
  ApplicationError,
  AlertEvent,
} from "../types/monitoring.types";

export async function getMetrics(): Promise<
  PerformanceMetric[]
> {
  const response =
    await api.get<
      ApiResponse<PerformanceMetric[]>
    >("/monitoring/metrics");

  return response.data.data;
}

export async function getErrors(): Promise<
  ApplicationError[]
> {
  const response =
    await api.get<
      ApiResponse<ApplicationError[]>
    >("/monitoring/errors");

  return response.data.data;
}

export async function getAlerts(): Promise<
  AlertEvent[]
> {
  const response =
    await api.get<
      ApiResponse<AlertEvent[]>
    >("/monitoring/alerts");

  return response.data.data;
}