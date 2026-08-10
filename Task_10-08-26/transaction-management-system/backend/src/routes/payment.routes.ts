import { Router } from "express";

import {
  getPaymentController,
} from "../controllers/payment.controller";

const router = Router();

router.get(
  "/:orderId",
  getPaymentController
);

export default router;