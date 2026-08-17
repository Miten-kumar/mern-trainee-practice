export interface HealthResponse {
  success: boolean;
  status: "ok" | "error";
  environment: string;
  database: "connected" | "disconnected";
  timestamp: string;
}