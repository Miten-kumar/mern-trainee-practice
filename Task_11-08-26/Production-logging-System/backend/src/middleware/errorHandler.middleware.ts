import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { PrismaClient } from "@prisma/client";

import { loggerService } from "../services/logger.service.js";

const prisma = new PrismaClient();

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const statusCode =
    (err as Error & { statusCode?: number })
      .statusCode ?? 500;

  const correlationId =
    req.correlationId;

  // Winston logging
  loggerService.error(
    err.message,
    {
      correlationId,
      method: req.method,
      route: req.originalUrl,
      statusCode,
      stack: err.stack,
    }
  );

  // Save application error
  try {
    await prisma.applicationError.create({
      data: {
        message: err.message,
        stack: err.stack ?? null,
        level:
          statusCode >= 500
            ? "error"
            : "warn",
        method: req.method,
        route: req.originalUrl,
        statusCode,
        correlationId,
      },
    });
  } catch (dbError) {
    loggerService.error(
      "Failed to save application error",
      {
        correlationId,
        error: dbError,
      }
    );
  }

  res.status(statusCode).json({
    success: false,
    message: err.message,
    correlationId,
  });
}