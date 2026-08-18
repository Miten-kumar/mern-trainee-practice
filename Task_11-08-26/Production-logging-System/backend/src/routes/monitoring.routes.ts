import { Router } from "express";

import {
  getAlerts,
  getErrors,
  getMetrics,
} from "../controllers/monitoring.controller.js";

const router = Router();

router.get("/metrics", getMetrics);

router.get("/errors", getErrors);

router.get("/alerts", getAlerts);

router.get("/test-error", (req, res, next) => {
  const error = new Error(
    "Test critical database error"
  );

  next(error);
});

export default router;