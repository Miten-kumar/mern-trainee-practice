import type { NextFunction, Request, Response } from "express";
import { checkoutService } from "../services/checkout.service.js";

interface CheckoutParams {
  id: string;
}

export class CheckoutController {

  // POST /api/v1/checkout
  async createCheckout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const checkout =
        await checkoutService.createCheckout(
          req.body
        );

      res.status(201).json({
        success: true,
        message: "Checkout created successfully",
        data: checkout,
      });
    } catch (error) {
      next(error);
    }
  }


  // GET /api/v1/checkout/:id
  async getCheckout(
    req: Request<CheckoutParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const checkout =
        await checkoutService.getCheckout(
          req.params.id
        );

      if (!checkout) {
        res.status(404).json({
          success: false,
          message: "Checkout not found",
        });

        return;
      }

      res.status(200).json({
        success: true,
        data: checkout,
      });
    } catch (error) {
      next(error);
    }
  }


  // PATCH /api/v1/checkout/:id/shipping
  async updateShipping(
    req: Request<CheckoutParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const checkout =
        await checkoutService.updateShipping(
          req.params.id,
          req.body.shippingAddress
        );

      res.status(200).json({
        success: true,
        message: "Shipping information updated",
        data: checkout,
      });
    } catch (error) {
      next(error);
    }
  }


  // POST /api/v1/checkout/:id/payment
  async processPayment(
    req: Request<CheckoutParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const checkout =
        await checkoutService.processPayment(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "Payment processed successfully",
        data: checkout,
      });
    } catch (error) {
      next(error);
    }
  }


  // POST /api/v1/checkout/:id/payment/retry
  async retryPayment(
    req: Request<CheckoutParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const checkout =
        await checkoutService.retryPayment(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "Payment retry completed",
        data: checkout,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const checkoutController =
  new CheckoutController();