import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { loggerService } from "../services/logger.service.js";
import { metricsService } from "../services/metrics.service.js";

export function performanceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();

    const responseTime =
      Number(endTime - startTime) / 1_000_000;

    const roundedResponseTime = Number(
      responseTime.toFixed(2)
    );

    loggerService.info(
      "Performance metric",
      {
        metric: "http_request_duration",
        method: req.method,
        route: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: roundedResponseTime,
        correlationId:
          req.correlationId,
      }
    );

    void metricsService.recordRequest({
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: roundedResponseTime,
      correlationId:
        req.correlationId,
    });
  });

  next();
}