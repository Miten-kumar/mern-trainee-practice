import "reflect-metadata";

import express from "express";
import cors from "cors";

import {
  env,
} from "./config/env";

import userRoutes from "./routes/user.routes";

import {
  notFoundMiddleware,
} from "./middleware/notFoundMiddleware";

import {
  errorMiddleware,
} from "./middleware/errorMiddleware";

const app =
  express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.get(
  "/health",
  (_req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Decorator Validation API is running",
      environment: env.nodeEnv,
    });
  }
);

app.use(
  "/api/v1/users",
  userRoutes
);

app.use(
  notFoundMiddleware
);

app.use(
  errorMiddleware
);

export default app;