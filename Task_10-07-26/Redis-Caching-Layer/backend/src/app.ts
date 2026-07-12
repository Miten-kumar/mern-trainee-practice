import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";

import { rateLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redis Rate Limiter
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Redis Caching API is running ",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;