import prisma from "../config/database.js";

import {
  PerformanceMetricInput,
} from "../types/performance.types.js";

export const performanceService = {
  async createMetric(
    data: PerformanceMetricInput
  ) {
    return prisma.performanceMetric.create({
      data: {
        metric: data.metric,
        value: data.value,
        rating: data.rating,
        page: data.page,
        device: data.device,
        connection: data.connection,
        userAgent: data.userAgent,
      },
    });
  },

  async getMetrics() {
    return prisma.performanceMetric.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });
  },

  async getMetricsByPage(page: string) {
    return prisma.performanceMetric.findMany({
      where: {
        page,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });
  },

  async getMetricsByName(
    metric: PerformanceMetricInput["metric"]
  ) {
    return prisma.performanceMetric.findMany({
      where: {
        metric,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });
  },
};