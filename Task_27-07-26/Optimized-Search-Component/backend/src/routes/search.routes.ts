import { Router } from "express";
import { searchController } from "../controller/search.controller";

const router = Router();

/**
 * Search Products API
 *
 * GET /api/search?q=laptop
 *
 */
router.get(
    "/search",
    searchController
);

export default router;