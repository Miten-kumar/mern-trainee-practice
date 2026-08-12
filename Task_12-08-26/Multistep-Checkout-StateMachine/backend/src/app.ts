import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

/**
 * CORS
 *
 * Allows requests from React frontend.
 */
app.use(
  cors({
    origin: env.FRONTEND_URL,
  })
);

/**
 * Parse JSON request bodies.
 */
app.use(express.json());

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Checkout API is running",
  });
});

/**
 * Checkout API
 *
 * Base URL:
 * /api/v1/checkout
 */
app.use(
  "/api/v1/checkout",
  checkoutRoutes
);

/**
 * Global error handler
 *
 * This must be registered after routes.
 */
app.use(errorMiddleware);

export default app;