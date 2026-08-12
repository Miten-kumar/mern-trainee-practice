interface ConfirmationStepProps {
  orderId: string | null;
}

export default function ConfirmationStep({
  orderId,
}: ConfirmationStepProps) {
  return (
    <section className="confirmation">

      <div className="confirmation-icon">
        ✓
      </div>

      <h2>
        Order Confirmed!
      </h2>

      <p>
        Your payment was successful.
      </p>

      <p>
        Your order has been placed
        successfully.
      </p>

      <div className="order-id">
        <strong>
          Order ID:
        </strong>{" "}
        {orderId ?? "N/A"}
      </div>

    </section>
  );
}