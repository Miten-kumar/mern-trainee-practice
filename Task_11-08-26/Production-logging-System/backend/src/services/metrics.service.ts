import { prisma } from "../config/database.js";

import type {
  PerformanceMetricInput,
} from "../types/logging.types.js";

class MetricsService {
  async recordRequest(
    metric: PerformanceMetricInput
  ): Promise<void> {
    await prisma.performanceMetric.create({
      data: {
        method: metric.method,
        route: metric.route,
        statusCode: metric.statusCode,
        responseTime: metric.responseTime,
        correlationId:
          metric.correlationId,
      },
    });
  }

  async getRecentMetrics(
    limit = 100
  ) {
    return prisma.performanceMetric.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  async getAverageResponseTime(): Promise<number> {
    const result =
      await prisma.performanceMetric.aggregate({
        _avg: {
          responseTime: true,
        },
      });

    return result._avg.responseTime ?? 0;
  }
}

export const metricsService =
  new MetricsService();