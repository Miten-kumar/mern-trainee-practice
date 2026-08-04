import express from "express";


import {
    fetchProducts
} from "../controllers/product.controller";

const router =
express.Router();

// GET ALL PRODUCTS
// Cursor Pagination API

router.get(
    "/products",
    fetchProducts
);

export default router;