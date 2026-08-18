import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createOrder,
} from "../services/order.service";

export async function createOrderController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const order =
      await createOrder(req.body);

    res.status(201).json({
      success: true,
      message:
        "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}