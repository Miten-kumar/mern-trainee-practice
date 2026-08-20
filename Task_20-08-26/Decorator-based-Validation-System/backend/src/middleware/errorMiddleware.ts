import {
  Request,
  Response,
  NextFunction,
} from "express";

interface AppError
  extends Error {
  statusCode?: number;
}

export function errorMiddleware(
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(error);

  const statusCode =
    error.statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
}