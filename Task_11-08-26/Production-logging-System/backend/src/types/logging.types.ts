export type LogLevel =
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug";

export interface LogContext {
  correlationId?: string;
  userId?: number | string;
  method?: string;
  route?: string;
  statusCode?: number;
  responseTime?: number;
  ip?: string;
  [key: string]: unknown;
}

export interface ErrorLogContext extends LogContext {
  errorCode?: string;
  stack?: string;
}

export interface PerformanceMetricInput {
  method: string;
  route: string;
  statusCode: number;
  responseTime: number;
  correlationId?: string;
}

export type AlertSeverity =
  | "warning"
  | "high"
  | "critical";

export type AlertType =
  | "HIGH_ERROR_RATE"
  | "SLOW_RESPONSE"
  | "DATABASE_UNAVAILABLE"
  | "CRITICAL_ERROR";

export interface AlertInput {
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  threshold?: number;
  actualValue?: number;
  correlationId?: string;
}