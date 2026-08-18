import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.js";
import accessibilityRoutes from "./routes/accessibility.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

/**
 * Security middleware
 */
app.use(helmet());

/**
 * CORS configuration
 */
app.use(
  cors({
    origin: env.frontendUrl,
    methods: ["GET", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * Body parser
 */
app.use(express.json());

/**
 * Health check
 */
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Accessibility API is running",
  });
});

/**
 * API routes
 */
app.use(
  "/api/v1/accessibility",
  accessibilityRoutes
);

/**
 * 404 handler
 */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * Global error handler
 */
app.use(errorMiddleware);

export default app;