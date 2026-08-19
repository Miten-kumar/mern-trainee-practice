import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { env } from "./config/env.js";

import healthRoutes from "./routes/health.routes.js";
import performanceRoutes from "./routes/performance.routes.js";

import { requestTiming } from "./middleware/requestTiming.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

/**
 * Security
 */
const allowedOrigins = [
  env.FRONTEND_URL,
  env.FRONTEND_PREVIEW_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as server-to-server or Postman requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());

/**
 * Performance
 *
 * Compress API responses to reduce
 * network payload size.
 */
app.use(compression());

/**
 * Request parsing
 */
app.use(
  express.json({
    limit: "100kb",
  })
);

/**
 * Performance monitoring
 *
 * Measures API response time.
 */
app.use(requestTiming);

/**
 * Root endpoint
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Performance Optimization API",
    version: "v1",
  });
});

/**
 * API routes
 */
app.use(
  "/api/v1/health",
  healthRoutes
);

app.use(
  "/api/v1/performance",
  performanceRoutes
);

/**
 * Global error handler
 *
 * This must remain after all routes.
 */
app.use(errorHandler);

export default app;