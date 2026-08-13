import Field from './Field';
import { cartTotal } from '../machine/checkoutMachine';

export default function PaymentStep({ context, send }) {
  const p = context.payment;
  const set = (field) => (value) => send({ type: 'UPDATE_FIELD', field, value });
  const valid = p.cardName && p.cardNumber.replace(/\s/g, '').length >= 12 && p.expiry && p.cvv.length >= 3;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-1">Payment</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Charging <span className="font-mono text-[var(--text)]">₹{cartTotal(context.items).toLocaleString('en-IN')}</span>
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <Field label="Name on card" value={p.cardName} onChange={set('cardName')} placeholder="Meet Patel" />
        </div>
        <div className="col-span-2">
          <Field label="Card number" value={p.cardNumber} onChange={set('cardNumber')} placeholder="4242 4242 4242 4242" mono maxLength={19} />
        </div>
        <Field label="Expiry" value={p.expiry} onChange={set('expiry')} placeholder="MM/YY" mono maxLength={5} />
        <Field label="CVV" value={p.cvv} onChange={set('cvv')} placeholder="123" mono maxLength={4} type="password" />
      </div>

      <label className="flex items-center gap-2 mb-8 text-xs text-[var(--text-muted)] cursor-pointer select-none">
        <input
          type="checkbox"
          checked={context.simulateFailure}
          onChange={() => send({ type: 'TOGGLE_SIMULATE_FAILURE' })}
          className="accent-[var(--accent)] w-3.5 h-3.5"
        />
        Force a declined payment (demo the retry flow)
      </label>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <button
          onClick={() => send({ type: 'BACK' })}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-2"
        >
          ← Back to shipping
        </button>
        <button
          onClick={() => send({ type: 'NEXT' })}
          disabled={!valid}
          className="bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed text-[#1a1305] font-semibold text-sm px-6 py-3 rounded-lg hover:brightness-110 transition"
        >
          Pay now →
        </button>
      </div>
    </div>
  );
}
