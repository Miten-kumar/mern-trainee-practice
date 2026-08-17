import type { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";

export async function healthCheck(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      status: "ok",
      environment: env.NODE_ENV,
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(503).json({
      success: false,
      status: "error",
      environment: env.NODE_ENV,
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
}