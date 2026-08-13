const STEPS = [
  { key: 'cart', label: 'Cart' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmation', label: 'Done' },
];

const STATE_TO_STEP = {
  cart: 0,
  shipping: 1,
  payment: 2,
  processingPayment: 2,
  paymentError: 2,
  paymentFailed: 2,
  confirmation: 3,
};

export default function StepperHeader({ state }) {
  const activeIndex = STATE_TO_STEP[state] ?? 0;
  const isTrouble = state === 'paymentError' || state === 'paymentFailed';

  return (
    <div className="flex items-center w-full" aria-label="Checkout progress">
      {STEPS.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold border transition-colors shrink-0',
                  done
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[#1a1305]'
                    : active
                    ? isTrouble
                      ? 'border-[var(--error)] text-[var(--error)]'
                      : 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text-muted)]',
                ].join(' ')}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={[
                  'text-[11px] font-medium tracking-wide uppercase',
                  active ? 'text-[var(--text)]' : 'text-[var(--text-muted)]',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  'h-px flex-1 mx-3 mb-5 transition-colors',
                  done ? 'bg-[var(--accent)]' : 'bg-[var(--border)]',
                ].join(' ')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
