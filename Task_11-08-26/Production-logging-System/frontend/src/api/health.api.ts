import { api } from "./client";

import type {
  HealthResponse,
} from "../types/monitoring.types";

export async function getHealth(): Promise<HealthResponse> {
  const response =
    await api.get<HealthResponse>("/health");

  return response.data;
}