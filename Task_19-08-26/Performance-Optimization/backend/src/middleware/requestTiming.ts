import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export const requestTiming = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();

    const durationMs =
      Number(endTime - startTime) / 1_000_000;

    logger.info("HTTP Request", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    });
  });

  next();
};