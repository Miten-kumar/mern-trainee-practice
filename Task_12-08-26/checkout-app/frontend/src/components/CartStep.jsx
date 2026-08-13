import { CATALOG, cartTotal } from '../machine/checkoutMachine';

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

export default function CartStep({ context, send }) {
  const { items } = context;
  const addable = CATALOG.filter((c) => !items.find((i) => i.id === c.id));

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-1">Your cart</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        {items.length} item{items.length !== 1 ? 's' : ''} · review before you continue
      </p>

      <div className="space-y-3 mb-6">
        {items.length === 0 && (
          <div className="border border-dashed border-[var(--border)] rounded-xl py-10 text-center text-[var(--text-muted)] text-sm">
            Your cart is empty. Add something below to continue.
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4"
          >
            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-[var(--surface)] rounded-lg shrink-0">
              {item.image}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-[var(--text-muted)] font-mono">{fmt(item.price)} each</p>
            </div>
            <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
              <button
                onClick={() => send({ type: 'SET_QTY', id: item.id, qty: item.qty - 1 })}
                className="w-7 h-7 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-mono">{item.qty}</span>
              <button
                onClick={() => send({ type: 'SET_QTY', id: item.id, qty: item.qty + 1 })}
                className="w-7 h-7 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                aria-label={`Increase quantity of ${item.name}`}
              >
                +
              </button>
            </div>
            <p className="text-sm font-mono w-20 text-right">{fmt(item.price * item.qty)}</p>
            <button
              onClick={() => send({ type: 'REMOVE_ITEM', id: item.id })}
              className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors text-sm px-1"
              aria-label={`Remove ${item.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {addable.length > 0 && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Add more</p>
          <div className="flex flex-wrap gap-2">
            {addable.map((c) => (
              <button
                key={c.id}
                onClick={() => send({ type: 'ADD_ITEM', item: c })}
                className="text-xs font-mono px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {c.image} {c.name} · {fmt(c.price)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <div>
          <p className="text-xs text-[var(--text-muted)]">Total</p>
          <p className="font-display text-xl font-semibold">{fmt(cartTotal(items))}</p>
        </div>
        <button
          onClick={() => send({ type: 'NEXT' })}
          disabled={items.length === 0}
          className="bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed text-[#1a1305] font-semibold text-sm px-6 py-3 rounded-lg hover:brightness-110 transition"
        >
          Continue to shipping →
        </button>
      </div>
    </div>
  );
}
