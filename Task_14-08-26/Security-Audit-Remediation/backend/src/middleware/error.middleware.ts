import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { logger } from "../utils/logger.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error("Unhandled request error", {
    error:
      error instanceof Error
        ? error.message
        : "Unknown error",

    code:
      typeof error === "object" &&
      error !== null &&
      "code" in error
        ? (error as { code?: string }).code
        : undefined,
  });

  /**
   * CSRF validation error
   */
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code ===
      "EBADCSRFTOKEN"
  ) {
    res.status(403).json({
      success: false,
      message: "Invalid or missing CSRF token",
    });

    return;
  }

  /**
   * Normal application errors
   */
  if (error instanceof Error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });

    return;
  }

  /**
   * Unknown errors
   */
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};