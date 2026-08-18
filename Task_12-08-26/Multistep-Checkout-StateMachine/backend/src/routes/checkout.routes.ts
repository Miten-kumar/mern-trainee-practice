import { Router } from "express";
import { checkoutController } from "../controller/checkout.controller";


const router = Router();

/**
 * Create checkout session
 *
 * POST /api/v1/checkout
 */
router.post(
  "/",
  checkoutController.createCheckout
);

/**
 * Get checkout session
 *
 * GET /api/v1/checkout/:id
 */
router.get(
  "/:id",
  checkoutController.getCheckout
);

/**
 * Update shipping information
 *
 * PATCH /api/v1/checkout/:id/shipping
 */
router.patch(
  "/:id/shipping",
  checkoutController.updateShipping
);

/**
 * Process payment
 *
 * POST /api/v1/checkout/:id/payment
 */
router.post(
  "/:id/payment",
  checkoutController.processPayment
);

/**
 * Retry failed payment
 *
 * POST /api/v1/checkout/:id/payment/retry
 */
router.post(
  "/:id/payment/retry",
  checkoutController.retryPayment
);

export default router;