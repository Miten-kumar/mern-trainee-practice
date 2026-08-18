import express from "express";
import cors from "cors";

import { env } from "./config/env";

import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import paymentRoutes from "./routes/payment.routes";

import {
  notFoundMiddleware,
} from "./middleware/notFound.middleware";

import {
  errorMiddleware,
} from "./middleware/error.middleware";

const app = express();

/*
 * CORS
 */
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

/*
 * Body parsers
 */
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
 * Health check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Transaction Management API is running",
  });
});

/*
 * API Routes
 */
app.use(
  "/api/v1/orders",
  orderRoutes
);

app.use(
  "/api/v1/products",
  productRoutes
);

app.use(
  "/api/v1/payments",
  paymentRoutes
);

/*
 * 404 Handler
 *
 * This must come after all routes.
 */
app.use(notFoundMiddleware);

/*
 * Global Error Handler
 *
 * This must be the last middleware.
 */
app.use(errorMiddleware);

export default app;