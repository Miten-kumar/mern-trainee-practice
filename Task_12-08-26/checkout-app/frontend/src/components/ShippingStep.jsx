import Field from './Field';

export default function ShippingStep({ context, send }) {
  const s = context.shipping;
  const set = (field) => (value) => send({ type: 'UPDATE_FIELD', field, value });
  const valid = s.name && s.address && s.city && s.zip && s.phone;

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-1">Shipping details</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">Where should we send your order?</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="col-span-2">
          <Field label="Full name" value={s.name} onChange={set('name')} placeholder="Meet Patel" />
        </div>
        <div className="col-span-2">
          <Field label="Address" value={s.address} onChange={set('address')} placeholder="Street, area" />
        </div>
        <Field label="City" value={s.city} onChange={set('city')} placeholder="Ahmedabad" />
        <Field label="PIN code" value={s.zip} onChange={set('zip')} placeholder="380015" mono maxLength={6} />
        <div className="col-span-2">
          <Field label="Phone" value={s.phone} onChange={set('phone')} placeholder="98765 43210" mono />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <button
          onClick={() => send({ type: 'BACK' })}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-2"
        >
          ← Back to cart
        </button>
        <button
          onClick={() => send({ type: 'NEXT' })}
          disabled={!valid}
          className="bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed text-[#1a1305] font-semibold text-sm px-6 py-3 rounded-lg hover:brightness-110 transition"
        >
          Continue to payment →
        </button>
      </div>
    </div>
  );
}
