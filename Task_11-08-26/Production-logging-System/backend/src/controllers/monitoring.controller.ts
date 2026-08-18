import type { Request, Response } from "express";

import { prisma } from "../config/database.js";
import { logger } from "../config/logger.js";

export async function getMetrics(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const metrics = await prisma.performanceMetric.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    logger.error("Failed to fetch performance metrics", {
      error,
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch performance metrics",
    });
  }
}

export async function getErrors(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const errors = await prisma.applicationError.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    res.status(200).json({
      success: true,
      data: errors,
    });
  } catch (error) {
    logger.error("Failed to fetch application errors", {
      error,
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch application errors",
    });
  }
}

export async function getAlerts(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const alerts = await prisma.alertEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    logger.error("Failed to fetch alert events", {
      error,
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch alert events",
    });
  }
}