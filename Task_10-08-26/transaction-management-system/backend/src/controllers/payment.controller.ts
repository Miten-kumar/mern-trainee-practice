import { Request, Response, NextFunction, } from "express";
import { prisma } from "../config/prisma";


export async function getPaymentController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const orderId =
      Number(req.params.orderId);

    if (
      !Number.isInteger(orderId) ||
      orderId <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });

      return;
    }

    const payment =
      await prisma.payment.findUnique({
        where: {
          orderId,
        },
      });

    if (!payment) {
      res.status(404).json({
        success: false,
        message:
          "Payment not found for this order",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
}