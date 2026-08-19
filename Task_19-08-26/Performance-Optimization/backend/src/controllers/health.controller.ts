import { Request, Response } from "express";

export const healthCheck = (
  _req: Request,
  res: Response
): void => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "performance-optimization-api",
    timestamp: new Date().toISOString(),
  });
};