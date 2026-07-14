import { Router } from "express";
import {
  fetchProductsFromDB,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../data.js";
import { getOrSetCache, invalidateCache } from "../utils/cacheLock.js";

const router = Router();
const PRODUCTS_CACHE_KEY = "products:all";
const CACHE_TTL_SECONDS = 30;

router.get("/products", async (req, res) => {
  const { data, fromCache } = await getOrSetCache(
    PRODUCTS_CACHE_KEY,
    fetchProductsFromDB,
    CACHE_TTL_SECONDS
  );
  res.json({ source: fromCache ? "cache" : "db", products: data });
});

router.post("/products", async (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: "name and price are required" });
  }

  const product = addProduct({ name, price, stock: stock ?? 0 });

  // data changed, cached list is now stale - clear it so the next
  // GET rebuilds it from the "db"
  await invalidateCache(PRODUCTS_CACHE_KEY);

  res.status(201).json(product);
});

router.put("/products/:id", async (req, res) => {
  const updated = updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "product not found" });
  }

  await invalidateCache(PRODUCTS_CACHE_KEY);
  res.json(updated);
});

router.delete("/products/:id", async (req, res) => {
  const deleted = deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "product not found" });
  }

  await invalidateCache(PRODUCTS_CACHE_KEY);
  res.json({ deleted: true });
});

export default router;
