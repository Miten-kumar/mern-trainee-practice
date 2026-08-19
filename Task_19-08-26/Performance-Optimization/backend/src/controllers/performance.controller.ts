import { Request,Response,NextFunction } from "express";
import { z } from "zod";
import { performanceService } from "../services/performance.service.js";

const performanceMetricSchema = z.object({
  metric: z.enum([
    "LCP",
    "INP",
    "CLS",
    "FCP",
    "TTFB",
  ]),

  value: z
    .number()
    .finite()
    .nonnegative(),

  rating: z.enum([
    "good",
    "needs-improvement",
    "poor",
  ]),

  page: z
    .string()
    .min(1)
    .max(500),

  device: z
    .string()
    .max(100)
    .optional(),

  connection: z
    .string()
    .max(100)
    .optional(),

  userAgent: z
    .string()
    .max(1000)
    .optional(),
});

export const createPerformanceMetric = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData =
      performanceMetricSchema.parse(req.body);

    const metric =
      await performanceService.createMetric(
        validatedData
      );

    res.status(201).json({
      success: true,
      message: "Performance metric recorded successfully",
      data: metric,
    });
  } catch (error) {
    next(error);
  }
};

export const getPerformanceMetrics = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const metrics =
      await performanceService.getMetrics();

    res.status(200).json({
      success: true,
      count: metrics.length,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};