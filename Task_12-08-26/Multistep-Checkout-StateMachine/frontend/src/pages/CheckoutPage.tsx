import { useMachine } from "@xstate/react";

import { checkoutMachine } from "../machine/checkout.machine.js";

import CartStep from "../components/CartStep";
import ShippingStep from "../components/ShippingStep";
import PaymentStep from "../components/PaymentStep";
import PaymentError from "../components/PaymentError";
import ConfirmationStep from "../components/ConformationStep.js";

import "../styles/checkout.css";

export default function CheckoutPage() {
  const [snapshot, send] =
    useMachine(checkoutMachine);

  const state = snapshot.value;

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* =========================
            HEADER
        ========================= */}

        <header className="checkout-header">

          <h1>
            Multi-Step Checkout
          </h1>

          <p>
            Complete your order in a few
            simple steps.
          </p>

        </header>

        {/* =========================
            PROGRESS
        ========================= */}

        <div className="checkout-progress">

          <div
            className={`progress-step ${
              state === "cart"
                ? "active"
                : state === "creatingCheckout" ||
                  state === "shipping" ||
                  state === "updatingShipping" ||
                  state === "shippingError" ||
                  state === "payment" ||
                  state === "processingPayment" ||
                  state === "paymentError" ||
                  state === "retryingPayment" ||
                  state === "confirmation"
                  ? "completed"
                  : ""
            }`}
          >
            1. Cart
          </div>

          <div
            className={`progress-step ${
              state === "shipping" ||
              state === "updatingShipping" ||
              state === "shippingError"
                ? "active"
                : state === "payment" ||
                  state === "processingPayment" ||
                  state === "paymentError" ||
                  state === "retryingPayment" ||
                  state === "confirmation"
                  ? "completed"
                  : ""
            }`}
          >
            2. Shipping
          </div>

          <div
            className={`progress-step ${
              state === "payment" ||
              state === "processingPayment" ||
              state === "paymentError" ||
              state === "retryingPayment"
                ? "active"
                : state === "confirmation"
                  ? "completed"
                  : ""
            }`}
          >
            3. Payment
          </div>

          <div
            className={`progress-step ${
              state === "confirmation"
                ? "active"
                : ""
            }`}
          >
            4. Confirmation
          </div>

        </div>

        {/* =========================
            MAIN CARD
        ========================= */}

        <div className="checkout-card">

          {/* =========================
              CART
          ========================= */}

          {state === "cart" && (
            <CartStep
              onNext={() =>
                send({
                  type: "NEXT_FROM_CART",
                })
              }
            />
          )}

          {/* =========================
              CREATING CHECKOUT
          ========================= */}

          {state === "creatingCheckout" && (
            <section className="loading">

              <div className="loading-spinner" />

              <h2>
                Creating Checkout...
              </h2>

              <p>
                Please wait while we create
                your checkout.
              </p>

            </section>
          )}

          {/* =========================
              SHIPPING
          ========================= */}

          {state === "shipping" && (
            <ShippingStep
              onSubmit={(shippingAddress) =>
                send({
                  type: "SHIPPING_SUBMIT",
                  shippingAddress,
                })
              }
              onBack={() =>
                send({
                  type: "BACK",
                })
              }
            />
          )}

          {/* =========================
              UPDATING SHIPPING
          ========================= */}

          {state === "updatingShipping" && (
            <section className="loading">

              <div className="loading-spinner" />

              <h2>
                Saving Shipping Information...
              </h2>

              <p>
                Please wait.
              </p>

            </section>
          )}

          {/* =========================
              SHIPPING ERROR
          ========================= */}

          {state === "shippingError" && (
            <section>

              <h2>
                Shipping Error
              </h2>

              <div
                className="error-box"
                role="alert"
              >
                {snapshot.context.error ??
                  "Failed to save shipping information."}
              </div>

              <div className="checkout-actions">

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() =>
                    send({
                      type: "BACK",
                    })
                  }
                >
                  ← Back
                </button>

                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() =>
                    send({
                      type: "SHIPPING_SUBMIT",
                      shippingAddress:
                        snapshot.context
                          .shippingAddress!,
                    })
                  }
                >
                  Try Again
                </button>

              </div>

            </section>
          )}

          {/* =========================
              PAYMENT
          ========================= */}

          {state === "payment" && (
            <PaymentStep
              onSubmit={(paymentMethod) =>
                send({
                  type: "PAYMENT_SUBMIT",
                  paymentMethod,
                })
              }
              onBack={() =>
                send({
                  type: "BACK",
                })
              }
            />
          )}

          {/* =========================
              PROCESSING PAYMENT
          ========================= */}

          {state === "processingPayment" && (
            <section className="loading">

              <div className="loading-spinner" />

              <h2>
                Processing Payment...
              </h2>

              <p>
                Please do not close this page.
              </p>

            </section>
          )}

          {/* =========================
              PAYMENT ERROR
          ========================= */}

            {/* =========================
    PAYMENT ERROR
========================= */}

{state === "paymentError" && (
  <PaymentError
    error={snapshot.context.error}
    retryCount={snapshot.context.retryCount}
    paymentMethod={snapshot.context.paymentMethod}
    onRetry={(paymentMethod) =>
      send({
        type: "RETRY_PAYMENT",
        paymentMethod,
      })
    }
    onBack={() =>
      send({
        type: "BACK",
      })
    }
  />
)}
         

          {/* =========================
              RETRYING PAYMENT
          ========================= */}

          {state === "retryingPayment" && (
            <section className="loading">

              <div className="loading-spinner" />

              <h2>
                Retrying Payment...
              </h2>

              <p>
                Please wait while we retry
                your payment.
              </p>

            </section>
          )}

          {/* =========================
              CONFIRMATION
          ========================= */}

          {state === "confirmation" && (
            <ConfirmationStep
              orderId={
                snapshot.context.orderId
              }
            />
          )}

          {/* =========================
              CHECKOUT ERROR
          ========================= */}

          {state === "checkoutError" && (
            <section>

              <h2>
                Checkout Error
              </h2>

              <div
                className="error-box"
                role="alert"
              >
                {snapshot.context.error ??
                  "Something went wrong."}
              </div>

              <div className="checkout-actions">

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() =>
                    send({
                      type: "BACK",
                    })
                  }
                >
                  ← Back
                </button>

                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() =>
                    send({
                      type: "NEXT_FROM_CART",
                    })
                  }
                >
                  Try Again
                </button>

              </div>

            </section>
          )}

        </div>

      </div>

    </main>
  );
}