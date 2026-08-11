import type { NextFunction, Request, Response, } from "express";
import { logger } from "../config/logger.js";


export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = process.hrtime.bigint();

  logger.info("Incoming request", {
    method: req.method,
    route: req.originalUrl,
    ip: req.ip,
    correlationId: req.correlationId,
  });

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();

    const duration =
      Number(endTime - startTime) / 1_000_000;

    logger.info("Request completed", {
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: Number(duration.toFixed(2)),
      correlationId: req.correlationId,
    });
  });

  next();
}