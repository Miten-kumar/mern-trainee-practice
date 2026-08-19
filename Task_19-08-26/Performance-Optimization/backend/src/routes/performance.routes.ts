import { Router } from "express";

import {
  createPerformanceMetric,
  getPerformanceMetrics,
} from "../controllers/performance.controller.js";

const router = Router();

router.post(
  "/rum",
  createPerformanceMetric
);

router.get(
  "/rum",
  getPerformanceMetrics
);

export default router;