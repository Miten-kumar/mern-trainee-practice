import type {
  PaymentMethod,
} from "../machine/checkout.types";

interface PaymentStepProps {
  onSubmit: (
    paymentMethod: PaymentMethod
  ) => void;

  onBack: () => void;
}

export default function PaymentStep({
  onSubmit,
  onBack,
}: PaymentStepProps) {
  return (
    <section>

      <h2>
        Payment
      </h2>

      <p>
        Select your preferred payment
        method to complete your order.
      </p>

      {/* Payment Options */}
      <div className="payment-options">

        {/* UPI */}
        <button
          className="payment-option"
          type="button"
          onClick={() =>
            onSubmit("UPI")
          }
        >
          <strong>
            UPI
          </strong>

          <span>
            Pay securely using UPI
          </span>
        </button>

        {/* Card */}
        <button
          className="payment-option"
          type="button"
          onClick={() =>
            onSubmit("CARD")
          }
        >
          <strong>
            Card
          </strong>

          <span>
            Credit / Debit Card
          </span>
        </button>

        <button
    className="payment-option"
    type="button"
    onClick={() =>
      onSubmit("FAIL")
    }
  >
    <strong>
      ❌ Test Payment Failure
    </strong>

    <span>
      Test error and retry
    </span>
  </button>


      </div>

      {/* Actions */}
      <div className="checkout-actions">

        <button
          className="btn btn-secondary"
          type="button"
          onClick={onBack}
        >
          ← Back to Shipping
        </button>

      </div>

    </section>
  );
}