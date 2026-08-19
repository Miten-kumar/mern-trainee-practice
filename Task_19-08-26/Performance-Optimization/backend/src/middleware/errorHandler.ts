import { Request,Response,NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error("Unhandled application error", {
    error,
  });

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};