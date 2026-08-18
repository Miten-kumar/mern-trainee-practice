import {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../config/prisma";

export async function getProductsController(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const products =
      await prisma.product.findMany({
        orderBy: {
          id: "asc",
        },
      });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}