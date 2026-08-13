export default function PaymentErrorStep({ context, send }) {
  const attemptsLeft = context.maxRetries - context.retryCount;

  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-12 h-12 rounded-full bg-[var(--error)]/10 border border-[var(--error)]/40 flex items-center justify-center text-2xl mb-5">
        ⚠
      </div>
      <h2 className="font-display text-xl font-semibold mb-1">Payment didn't go through</h2>
      <p className="text-sm text-[var(--text-muted)] font-mono max-w-sm mb-1">{context.error}</p>
      <p className="text-xs text-[var(--text-muted)] mb-8">
        Attempt {context.retryCount} of {context.maxRetries} · {attemptsLeft} retr{attemptsLeft === 1 ? 'y' : 'ies'} left
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => send({ type: 'EDIT_PAYMENT' })}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-4 py-2.5"
        >
          Edit card details
        </button>
        <button
          onClick={() => send({ type: 'RETRY' })}
          className="bg-[var(--accent)] text-[#1a1305] font-semibold text-sm px-6 py-2.5 rounded-lg hover:brightness-110 transition"
        >
          Retry payment
        </button>
      </div>
    </div>
  );
}
