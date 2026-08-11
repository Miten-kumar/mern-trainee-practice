export interface HealthResponse {
  status: "healthy" | "unhealthy";
  database: "connected" | "disconnected";
  uptime: number;
  timestamp: string;
}

export interface PerformanceMetric {
  id: number;
  method: string;
  route: string;
  statusCode: number;
  responseTime: number;
  correlationId: string | null;
  createdAt: string;
}

export interface ApplicationError {
  id: number;
  message: string;
  stack: string | null;
  level: string;
  method: string | null;
  route: string | null;
  statusCode: number | null;
  correlationId: string | null;
  userId: number | null;
  metadata: unknown;
  createdAt: string;
}

export interface AlertEvent {
  id: number;
  type: string;
  severity: string;
  message: string;
  threshold: number | null;
  actualValue: number | null;
  correlationId: string | null;
  resolved: boolean;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}