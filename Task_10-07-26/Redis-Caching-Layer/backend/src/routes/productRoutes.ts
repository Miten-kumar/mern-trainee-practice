import { Router } from "express";

import {
  getProducts,
  updateProduct,
} from "../controllers/productController";

import {
  authMiddleware,
} from "../middleware/auth";

const router = Router();

// Get all products
router.get(
  "/",
  getProducts
);
// Update product
router.put(
  "/:id",
  updateProduct
);

export default router;