import { cartTotal } from '../machine/checkoutMachine';

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

export default function ConfirmationStep({ context, send }) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-14 h-14 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/40 flex items-center justify-center text-2xl mb-5 text-[var(--success)]">
        ✓
      </div>
      <h2 className="font-display text-2xl font-semibold mb-1">Order confirmed</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Order <span className="font-mono text-[var(--text)]">{context.orderId}</span> is on its way to {context.shipping.city}.
      </p>

      <div className="w-full text-left bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 mb-8">
        {context.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1.5">
            <span className="text-[var(--text-muted)]">
              {item.qty}× {item.name}
            </span>
            <span className="font-mono">{fmt(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm pt-2.5 mt-2 border-t border-[var(--border)] font-semibold">
          <span>Total paid</span>
          <span className="font-mono">{fmt(cartTotal(context.items))}</span>
        </div>
      </div>

      <button
        onClick={() => send({ type: 'NEW_ORDER' })}
        className="bg-[var(--accent)] text-[#1a1305] font-semibold text-sm px-6 py-3 rounded-lg hover:brightness-110 transition"
      >
        Start a new order
      </button>
    </div>
  );
}
