import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import type { AlertInput } from "../types/logging.types.js";


class AlertingService {
  async createAlert(
    alert: AlertInput
  ): Promise<void> {
    await prisma.alertEvent.create({
      data: {
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        threshold: alert.threshold,
        actualValue: alert.actualValue,
        correlationId:
          alert.correlationId,
      },
    });
  }

  async checkCriticalError(
    statusCode: number,
    correlationId?: string
  ): Promise<void> {
    if (statusCode >= 500) {
      await this.createAlert({
        type: "CRITICAL_ERROR",
        severity: "critical",
        message:
          "Critical application error detected",
        actualValue: statusCode,
        correlationId,
      });
    }
  }

  async checkResponseTime(
    responseTime: number,
    correlationId?: string
  ): Promise<void> {
    if (
      responseTime >=
      env.alertResponseTimeThreshold
    ) {
      await this.createAlert({
        type: "SLOW_RESPONSE",
        severity: "high",
        message:
          "Response time exceeded configured threshold",
        threshold:
          env.alertResponseTimeThreshold,
        actualValue: responseTime,
        correlationId,
      });
    }
  }

  async checkErrorRate(
    errorCount: number,
    correlationId?: string
  ): Promise<void> {
    if (
      errorCount >=
      env.alertErrorThreshold
    ) {
      await this.createAlert({
        type: "HIGH_ERROR_RATE",
        severity: "critical",
        message:
          "Error count exceeded configured threshold",
        threshold:
          env.alertErrorThreshold,
        actualValue: errorCount,
        correlationId,
      });
    }
  }

  async databaseUnavailable(
    correlationId?: string
  ): Promise<void> {
    await this.createAlert({
      type: "DATABASE_UNAVAILABLE",
      severity: "critical",
      message:
        "Database connection is unavailable",
      correlationId,
    });
  }
}

export const alertingService =
  new AlertingService();