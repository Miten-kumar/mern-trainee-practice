import type {
  ErrorRequestHandler,
} from "express";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  console.error("Error:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Internal server error";

  res.status(500).json({
    success: false,
    message,
  });
};