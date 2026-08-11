import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.js";

import {
  correlationIdMiddleware,
} from "./middleware/correlationId.middleware.js";

import {
  requestLoggerMiddleware,
} from "./middleware/requestLogger.middleware.js";

import {
  performanceMiddleware,
} from "./middleware/performance.middleware.js";

import {
  notFoundMiddleware,
} from "./middleware/notFound.middleware.js";



import healthRoutes from "./routes/health.routes.js";
import monitoringRoutes from "./routes/monitoring.routes.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

export const app = express();

/**
 * Security middleware
 */
app.use(helmet());

/**
 * CORS
 */
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

/**
 * Body parser
 */
app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

/**
 * Request tracing
 */
app.use(correlationIdMiddleware);

/**
 * Request logging
 */
app.use(requestLoggerMiddleware);

/**
 * Performance monitoring
 */
app.use(performanceMiddleware);

/**
 * Health routes
 */
app.use("/api/health", healthRoutes);

/**
 * Monitoring routes
 */
app.use(
  "/api/monitoring",
  monitoringRoutes
);

/**
 * 404 handler
 */
app.use(notFoundMiddleware);

/**
 * Global error handler
 */
app.use(errorHandler);