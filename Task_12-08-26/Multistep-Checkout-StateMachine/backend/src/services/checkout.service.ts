import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";

import type {
  CreateCheckoutInput,
  PaymentInput,
  ShippingAddress,
} from "../types/checkout.types.js";

export class CheckoutService {

  /**
   * Create checkout session
   */
  async createCheckout(
    input: CreateCheckoutInput
  ) {
    return prisma.checkout.create({
      data: {
        cartId: input.cartId,
        status: "CART",
        paymentStatus: "PENDING",
        retryCount: 0,
      },
    });
  }


  /**
   * Get checkout session
   */
  async getCheckout(
    checkoutId: string
  ) {
    return prisma.checkout.findUnique({
      where: {
        id: checkoutId,
      },
    });
  }


  /**
   * Update shipping information
   */
    async updateShipping(
  checkoutId: string,
  shippingAddress: ShippingAddress
) {
  const checkout =
    await prisma.checkout.findUnique({
      where: {
        id: checkoutId,
      },
    });

  if (!checkout) {
    throw new Error("Checkout not found");
  }

  if (
    checkout.status !== "CART" &&
    checkout.status !== "SHIPPING"
  ) {
    throw new Error(
      "Shipping information cannot be updated at this stage"
    );
  }

  const shippingData: Prisma.InputJsonValue = {
    firstName: shippingAddress.firstName,
    lastName: shippingAddress.lastName,
    address: shippingAddress.address,
    city: shippingAddress.city,
    state: shippingAddress.state,
    pincode: shippingAddress.pincode,
    phone: shippingAddress.phone,
  };

  return prisma.checkout.update({
    where: {
      id: checkoutId,
    },

    data: {
      shippingAddress: shippingData,
      status: "PAYMENT",
    },
  });
}
  /**
   * Process payment
   */
  async processPayment(
    checkoutId: string,
    input: PaymentInput
  ) {

    const checkout =
      await prisma.checkout.findUnique({
        where: {
          id: checkoutId,
        },
      });

    if (!checkout) {
      throw new Error("Checkout not found");
    }

    if (!checkout.shippingAddress) {
      throw new Error(
        "Shipping information is required before payment"
      );
    }

    if (
      checkout.status !== "PAYMENT" &&
      checkout.status !== "PAYMENT_ERROR"
    ) {
      throw new Error(
        "Payment cannot be processed at this stage"
      );
    }

    /*
     * Move checkout into processing state.
     */
    await prisma.checkout.update({
      where: {
        id: checkoutId,
      },

      data: {
        paymentStatus: "PROCESSING",
        status: "PAYMENT",
        errorMessage: null,
      },
    });

    /*
     * Temporary payment simulation.
     *
     * Later you can replace this with
     * Razorpay / Stripe / another provider.
     */
    const paymentSuccessful =
      input.paymentMethod === "UPI" ||
      input.paymentMethod === "CARD";

    if (!paymentSuccessful) {

      return prisma.checkout.update({
        where: {
          id: checkoutId,
        },

        data: {
          status: "PAYMENT_ERROR",
          paymentStatus: "FAILED",
          errorMessage: "Payment failed",
          retryCount: {
            increment: 1,
          },
        },
      });
    }

    /*
     * Payment successful.
     */
    return prisma.checkout.update({
      where: {
        id: checkoutId,
      },

      data: {
        status: "CONFIRMATION",
        paymentStatus: "SUCCESS",
        orderId: `ORDER-${Date.now()}`,
        errorMessage: null,
      },
    });
  }


  /**
   * Retry failed payment
   */
  async retryPayment(
    checkoutId: string,
    input: PaymentInput
  ) {

    const checkout =
      await prisma.checkout.findUnique({
        where: {
          id: checkoutId,
        },
      });

    if (!checkout) {
      throw new Error("Checkout not found");
    }

    if (
      checkout.status !== "PAYMENT_ERROR"
    ) {
      throw new Error(
        "Payment retry is only available after payment failure"
      );
    }

    if (checkout.retryCount >= 3) {
      throw new Error(
        "Maximum payment retry limit reached"
      );
    }

    return this.processPayment(
      checkoutId,
      input
    );
  }
}

export const checkoutService =
  new CheckoutService();