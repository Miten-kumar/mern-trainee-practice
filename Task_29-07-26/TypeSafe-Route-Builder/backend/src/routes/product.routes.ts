import { Router } from "express";
import { fetchProducts } from "../controllers/product.controller";

const router =
Router();

router.get(
    "/products",
    fetchProducts
);

export default router;