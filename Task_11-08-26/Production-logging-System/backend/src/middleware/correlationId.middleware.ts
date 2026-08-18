import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const incomingCorrelationId = req.header("X-Correlation-ID");

  const correlationId =
    incomingCorrelationId || randomUUID();

  req.correlationId = correlationId;

  res.setHeader(
    "X-Correlation-ID",
    correlationId
  );

  next();
}