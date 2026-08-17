import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Security headers
app.use(helmet());

// Frontend → Backend CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// JSON request body
app.use(express.json());

// Root endpoint
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CI/CD Backend API",
    environment: env.NODE_ENV,
  });
});

// API routes
app.use("/api/v1", routes);

// Global error handler
app.use(errorHandler);

export default app;