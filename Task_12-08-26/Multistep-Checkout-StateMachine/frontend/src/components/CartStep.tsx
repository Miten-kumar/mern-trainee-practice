interface CartStepProps {
  onNext: () => void;
}

export default function CartStep({
  onNext,
}: CartStepProps) {
  return (
    <section>
      <h2>Your Cart</h2>

      <p>
        Review your item before continuing
        to checkout.
      </p>

      <div className="product-card">
        <div className="product-info">
          <h3>Demo Product</h3>

          <p>
            Quantity: 1
          </p>

          <p>
            Product available
          </p>
        </div>

        <div className="product-price">
          ₹999
        </div>
      </div>

      <div className="checkout-actions">
        <span />

        <button
          className="btn btn-primary"
          type="button"
          onClick={onNext}
        >
          Continue to Shipping →
        </button>
      </div>
    </section>
  );
}