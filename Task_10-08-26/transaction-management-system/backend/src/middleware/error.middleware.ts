import {
  Request,
  Response,
  NextFunction,
} from "express";

import { logger } from "../utils/logger";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(error);

  const message =
    error instanceof Error
      ? error.message
      : "Internal server error";

  res.status(500).json({
    success: false,
    message,
  });
}