import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(error);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};