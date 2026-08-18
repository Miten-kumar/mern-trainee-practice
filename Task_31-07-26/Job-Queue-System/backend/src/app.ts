import express from "express";
import cors from "cors";

import jobRoutes from "./routes/job.routes";

import { logger } from "./middleware/logger.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { notFound } from "./middleware/notFound.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Queue API Running",
  });
});

app.use("/api/jobs", jobRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;