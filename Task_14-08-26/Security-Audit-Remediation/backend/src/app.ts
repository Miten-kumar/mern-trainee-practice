import express from "express";
import cookieParser from "cookie-parser";

import { helmetMiddleware,corsMiddleware } from "./config/security.js";
import { globalRateLimiter } from "./middleware/rateLimit.middleware.js";
import { sanitizeBody } from "./middleware/sanitize.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import apiRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

/**
 * Security
 */
app.disable("x-powered-by");

app.use(helmetMiddleware);

app.use(corsMiddleware);

/**
 * Request body parsing
 */
app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: false,
    limit: "1mb",
  })
);

/**
 * Cookies
 */
app.use(cookieParser());

/**
 * Global rate limiting
 */
app.use(globalRateLimiter);

/**
 * Input sanitization
 */
app.use(sanitizeBody);

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Security Audit API is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API routes
 */
app.use(
  "/api/v1/auth",
  authRoutes
);

app.use(
  "/api/v1/users",
  userRoutes
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
 * MUST be the last middleware.
 */
app.use(errorHandler);

export default app;