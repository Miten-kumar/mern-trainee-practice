import { assign, fromPromise, setup } from "xstate";
import {
  createCheckout,
  getCheckout,
  updateShipping,
  processPayment,
  retryPayment,
} from "../api/checkout.api.js";

import type {
  Checkout,
  PaymentMethod,
  ShippingAddress,
} from "./checkout.types.js";

interface CheckoutContext {
  checkoutId: string | null;

  cartId: string;

  shippingAddress: ShippingAddress | null;

  paymentMethod: PaymentMethod | null;

  orderId: string | null;

  error: string | null;

  retryCount: number;
}

type CheckoutEvent =
  | {
      type: "NEXT_FROM_CART";
    }
  | {
      type: "SHIPPING_SUBMIT";
      shippingAddress: ShippingAddress;
    }
  | {
      type: "PAYMENT_SUBMIT";
      paymentMethod: PaymentMethod;
    }
  | {
      type: "RETRY_PAYMENT";
      paymentMethod: PaymentMethod;
    }
  | {
      type: "BACK";
    }
  | {
      type: "RESTORE";
      checkoutId: string;
    };

export const checkoutMachine = setup({
  types: {
    context: {} as CheckoutContext,
    events: {} as CheckoutEvent,
  },

  actors: {
    /**
     * Create checkout
     */
    createCheckout: fromPromise<
      Checkout,
      {
        cartId: string;
      }
    >(async ({ input }) => {
      return createCheckout({
        cartId: input.cartId,
      });
    }),

    /**
     * Restore checkout from backend
     */
    restoreCheckout: fromPromise<
      Checkout,
      {
        checkoutId: string;
      }
    >(async ({ input }) => {
      return getCheckout(
        input.checkoutId
      );
    }),

    /**
     * Save shipping
     */
    updateShipping: fromPromise<
      Checkout,
      {
        checkoutId: string;
        shippingAddress: ShippingAddress;
      }
    >(async ({ input }) => {
      return updateShipping(
        input.checkoutId,
        input.shippingAddress
      );
    }),

    /**
     * Process payment
     */
    processPayment: fromPromise<
      Checkout,
      {
        checkoutId: string;
        paymentMethod: PaymentMethod;
      }
    >(async ({ input }) => {
      return processPayment(
        input.checkoutId,
        {
          paymentMethod:
            input.paymentMethod,
        }
      );
    }),

    /**
     * Retry payment
     */
    retryPayment: fromPromise<
      Checkout,
      {
        checkoutId: string;
        paymentMethod: PaymentMethod;
      }
    >(async ({ input }) => {
      return retryPayment(
        input.checkoutId,
        {
          paymentMethod:
            input.paymentMethod,
        }
      );
    }),
  },

}).createMachine({

  id: "checkout",

  initial: "cart",

  context: {
    checkoutId: null,

    cartId: "cart-001",

    shippingAddress: null,

    paymentMethod: null,

    orderId: null,

    error: null,

    retryCount: 0,
  },

  states: {

    // =====================================
    // CART
    // =====================================

    cart: {
      on: {
        NEXT_FROM_CART: {
          target: "creatingCheckout",
        },

        RESTORE: {
          target: "restoringCheckout",
        },
      },
    },

    // =====================================
    // CREATE CHECKOUT
    // =====================================

    creatingCheckout: {

      invoke: {

        src: "createCheckout",

        input: ({
          context,
        }) => ({
          cartId: context.cartId,
        }),

        onDone: {

          target: "shipping",

          actions: assign({
            checkoutId: ({
              event,
            }) => event.output.id,

            error: null,
          }),
        },

        onError: {

          target: "checkoutError",

          actions: assign({
            error: ({
              event,
            }) =>
              event.error instanceof Error
                ? event.error.message
                : "Failed to create checkout",
          }),
        },
      },
    },

    // =====================================
    // RESTORE CHECKOUT
    // =====================================

    restoringCheckout: {

      invoke: {

        src: "restoreCheckout",

        input: ({
          event,
        }) => ({
          checkoutId: event.type === "RESTORE"
            ? event.checkoutId
            : "",
        }),

        onDone: [

          // CART
          {
            target: "cart",

            guard: ({
              event,
            }) =>
              event.output.status ===
              "CART",
          },

          // SHIPPING
          {
            target: "shipping",

            guard: ({
              event,
            }) =>
              event.output.status ===
              "SHIPPING",
          },

          // PAYMENT
          {
            target: "payment",

            guard: ({
              event,
            }) =>
              event.output.status ===
              "PAYMENT",
          },

          // PAYMENT ERROR
          {
            target: "paymentError",

            guard: ({
              event,
            }) =>
              event.output.status ===
              "PAYMENT_ERROR",

            actions: assign({
              error: ({
                event,
              }) =>
                event.output.errorMessage,
            }),
          },

          // CONFIRMATION
          {
            target: "confirmation",

            guard: ({
              event,
            }) =>
              event.output.status ===
              "CONFIRMATION",

            actions: assign({
              orderId: ({
                event,
              }) =>
                event.output.orderId,
            }),
          },
        ],

        onError: {

          target: "checkoutError",

          actions: assign({
            error: ({
              event,
            }) =>
              event.error instanceof Error
                ? event.error.message
                : "Failed to restore checkout",
          }),
        },
      },
    },

    // =====================================
    // SHIPPING
    // =====================================

    shipping: {

      on: {

        SHIPPING_SUBMIT: {

          target: "updatingShipping",

          actions: assign({
            shippingAddress: ({
              event,
            }) =>
              event.shippingAddress,

            error: null,
          }),
        },

        BACK: {
          target: "cart",
        },
      },
    },

    // =====================================
    // UPDATE SHIPPING
    // =====================================

    updatingShipping: {

      invoke: {

        src: "updateShipping",

        input: ({
          context,
        }) => ({
          checkoutId:
            context.checkoutId!,

          shippingAddress:
            context.shippingAddress!,
        }),

        onDone: {

          target: "payment",

          actions: assign({
            error: null,
          }),
        },

        onError: {

          target: "shippingError",

          actions: assign({
            error: ({
              event,
            }) =>
              event.error instanceof Error
                ? event.error.message
                : "Failed to update shipping",
          }),
        },
      },
    },

    // =====================================
    // SHIPPING ERROR
    // =====================================

    shippingError: {

      on: {

        SHIPPING_SUBMIT: {

          target: "updatingShipping",

          actions: assign({
            shippingAddress: ({
              event,
            }) =>
              event.shippingAddress,

            error: null,
          }),
        },

        BACK: {
          target: "shipping",
        },
      },
    },

    // =====================================
    // PAYMENT
    // =====================================

    payment: {

      on: {

        PAYMENT_SUBMIT: {

          target: "processingPayment",

          actions: assign({
            paymentMethod: ({
              event,
            }) =>
              event.paymentMethod,

            error: null,
          }),
        },

        BACK: {
          target: "shipping",
        },
      },
    },

    // =====================================
    // PROCESSING PAYMENT
    // =====================================

    processingPayment: {

      invoke: {

        src: "processPayment",

        input: ({
          context,
        }) => ({
          checkoutId:
            context.checkoutId!,

          paymentMethod:
            context.paymentMethod!,
        }),

        onDone: [

          // SUCCESS
          {
            target: "confirmation",

            guard: ({
              event,
            }) =>
              event.output.paymentStatus ===
              "SUCCESS",

            actions: assign({
              orderId: ({
                event,
              }) =>
                event.output.orderId,

              retryCount: ({
                event,
              }) =>
                event.output.retryCount,

              error: null,
            }),
          },

          // FAILED
          {
            target: "paymentError",

            actions: assign({
              error: ({
                event,
              }) =>
                event.output.errorMessage ??
                "Payment failed",

              retryCount: ({
                event,
              }) =>
                event.output.retryCount,
            }),
          },
        ],

        onError: {

          target: "paymentError",

          actions: assign({
            error: ({
              event,
            }) =>
              event.error instanceof Error
                ? event.error.message
                : "Payment failed",
          }),
        },
      },
    },

    // =====================================
    // PAYMENT ERROR
    // =====================================

    paymentError: {

      on: {

        RETRY_PAYMENT: {

          target: "retryingPayment",

          actions: assign({
            paymentMethod: ({
              event,
            }) =>
              event.paymentMethod,

            error: null,
          }),
        },

        BACK: {
          target: "payment",
        },
      },
    },

    // =====================================
    // RETRY PAYMENT
    // =====================================

    retryingPayment: {

      invoke: {

        src: "retryPayment",

        input: ({
          context,
        }) => ({
          checkoutId:
            context.checkoutId!,

          paymentMethod:
            context.paymentMethod!,
        }),

        onDone: [

          // RETRY SUCCESS
          {
            target: "confirmation",

            guard: ({
              event,
            }) =>
              event.output.paymentStatus ===
              "SUCCESS",

            actions: assign({
              orderId: ({
                event,
              }) =>
                event.output.orderId,

              retryCount: ({
                event,
              }) =>
                event.output.retryCount,

              error: null,
            }),
          },

          // RETRY FAILED
          {
            target: "paymentError",

            actions: assign({
              error: ({
                event,
              }) =>
                event.output.errorMessage ??
                "Payment retry failed",

              retryCount: ({
                event,
              }) =>
                event.output.retryCount,
            }),
          },
        ],

        onError: {

          target: "paymentError",

          actions: assign({
            error: ({
              event,
            }) =>
              event.error instanceof Error
                ? event.error.message
                : "Payment retry failed",
          }),
        },
      },
    },

    // =====================================
    // CONFIRMATION
    // =====================================

    confirmation: {
      type: "final",
    },

    // =====================================
    // GENERAL ERROR
    // =====================================

    checkoutError: {

      on: {

        NEXT_FROM_CART: {

          target: "creatingCheckout",

          actions: assign({
            error: null,
          }),
        },

        BACK: {
          target: "cart",
        },
      },
    },
  },
});