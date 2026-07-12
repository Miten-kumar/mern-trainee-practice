import { Request, Response } from "express";
import prisma from "../config/prisma";
import redisKeys from "../utils/redisKeys";
import {
  getCache,
  setCache,
  deleteCache,
} from "../services/cacheService";
import {
  acquireLock,
  releaseLock,
} from "../services/lockService";

// GET ALL PRODUCTS
export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    // Check Redis Cache
    const cachedProducts = await getCache(redisKeys.PRODUCT_LIST);

    if (cachedProducts) {
      console.log(" Cache Hit");
      return res.status(200).json(cachedProducts);
    }

    // Acquire Lock
    const lock = await acquireLock(redisKeys.PRODUCT_LOCK);

    if (!lock) {
      return res.status(503).json({
        success: false,
        message: "Please try again in a moment.",
      });
    }

    // Fetch from PostgreSQL
    const products = await prisma.product.findMany();

    // Store in Redis
    await setCache(redisKeys.PRODUCT_LIST, products, 300);

    // Release Lock
    await releaseLock(redisKeys.PRODUCT_LOCK);

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: req.body,
    });

    // Invalidate Cache
    await deleteCache(redisKeys.PRODUCT_LIST);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};