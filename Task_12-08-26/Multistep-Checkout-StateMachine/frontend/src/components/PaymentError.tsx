import type { PaymentMethod } from "../machine/checkout.types";


interface PaymentErrorProps {
  error: string | null;

  retryCount: number;

  paymentMethod: PaymentMethod | null;

  onRetry: (
    paymentMethod: PaymentMethod
  ) => void;

  onBack: () => void;
}

export default function PaymentError({
  error,
  retryCount,
  paymentMethod,
  onRetry,
  onBack,
}: PaymentErrorProps) {
  const maxRetries = 3;

  const canRetry =
    retryCount < maxRetries;

  function handleRetry() {
    if (!paymentMethod) {
      return;
    }

    onRetry(paymentMethod);
  }

  return (
    <section className="payment-error">

      <h2>
        Payment Failed
      </h2>

      <div
        className="error-box"
        role="alert"
      >
        {error ??
          "Something went wrong with your payment."}
      </div>

      <p>
        Retry attempts:{" "}
        <strong>
          {retryCount}/{maxRetries}
        </strong>
      </p>

      {!canRetry && (
        <div
          className="error-box"
          role="alert"
        >
          Maximum retry attempts reached.
          Please try another payment method.
        </div>
      )}

      <div className="checkout-actions">

        {canRetry && (
          <button
            className="btn btn-danger"
            type="button"
            disabled={!paymentMethod}
            onClick={handleRetry}
          >
            Retry Payment
          </button>
        )}

        <button
          className="btn btn-secondary"
          type="button"
          onClick={onBack}
        >
          ← Back to Payment
        </button>

      </div>

    </section>
  );
}