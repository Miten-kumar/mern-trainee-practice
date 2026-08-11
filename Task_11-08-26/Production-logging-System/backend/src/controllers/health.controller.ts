import type { Request, Response } from "express";

import { prisma } from "../config/database.js";
import { logger } from "../config/logger.js";

export async function getHealth(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const health = {
      status: "healthy",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    logger.info("Health check successful", {
      database: "connected",
    });

    res.status(200).json(health);
  } catch (error) {
    logger.error("Health check failed", {
      error,
    });

    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }
}