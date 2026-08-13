export default function PaymentFailedStep({ send }) {
  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-12 h-12 rounded-full bg-[var(--error)]/10 border border-[var(--error)]/40 flex items-center justify-center text-2xl mb-5">
        ✕
      </div>
      <h2 className="font-display text-xl font-semibold mb-1">Payment failed</h2>
      <p className="text-sm text-[var(--text-muted)] max-w-sm mb-8">
        We couldn't charge your card after several attempts. No amount has been deducted. You can try a different card or return to your cart.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => send({ type: 'BACK_TO_CART' })}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-4 py-2.5"
        >
          Back to cart
        </button>
        <button
          onClick={() => send({ type: 'START_OVER' })}
          className="bg-[var(--accent)] text-[#1a1305] font-semibold text-sm px-6 py-2.5 rounded-lg hover:brightness-110 transition"
        >
          Try a different card
        </button>
      </div>
    </div>
  );
}
