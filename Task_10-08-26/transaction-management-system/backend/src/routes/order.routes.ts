import { Router } from "express";

import {
  createOrderController,
} from "../controllers/order.controller";

import {
  validate,
} from "../middleware/validation.middleware";

import {
  createOrderSchema,
} from "../schemas/order.schema";

const router = Router();

router.post(
  "/",
  validate(createOrderSchema),
  createOrderController
);

export default router;