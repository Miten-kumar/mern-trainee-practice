import React, { useState } from 'react';
import { api } from '../api/client.js';

const outcomeLabel = {
  confirmed: 'confirmed',
  payment_failed: 'payment declined',
  rejected: 'rejected'
};

export default function OrderConsole({ products, onOrderSettled }) {
  const [tab, setTab] = useState('order');

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Order console</h2>
        <div className="tabs">
          <button className={tab === 'order' ? 'tab active' : 'tab'} onClick={() => setTab('order')}>
            place order
          </button>
          <button className={tab === 'race' ? 'tab active' : 'tab'} onClick={() => setTab('race')}>
            concurrency lab
          </button>
        </div>
      </div>

      {tab === 'order' ? (
        <SingleOrderForm products={products} onOrderSettled={onOrderSettled} />
      ) : (
        <ConcurrencyLab products={products} onOrderSettled={onOrderSettled} />
      )}
    </div>
  );
}

function SingleOrderForm({ products, onOrderSettled }) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('shopper@example.com');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!productId) return;
    setBusy(true);
    setResult(null);
    try {
      const { data } = await api.placeOrder({
        customerEmail: email,
        items: [{ productId: Number(productId), quantity: Number(quantity) }]
      });
      setResult(data);
      onOrderSettled();
    } catch (err) {
      setResult({ error: true, message: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="console-body">
      <form className="order-form" onSubmit={submit}>
        <label>
          Product
          <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="" disabled>
              select a product…
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id} disabled={p.stock_quantity === 0}>
                {p.sku} — {p.name} ({p.stock_quantity} left)
              </option>
            ))}
          </select>
        </label>

        <div className="field-row">
          <label>
            Quantity
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </label>
          <label>
            Customer email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>

        <button type="submit" className="primary-btn" disabled={busy}>
          {busy ? 'processing…' : 'Place order'}
        </button>
        <p className="hint-line">
          Amounts ending in <code>.13</code> always trigger a simulated card decline, useful for demoing the
          rollback path on demand.
        </p>
      </form>

      {result && (
        <div className={`result-card ${result.error ? 'result-error' : `result-${result.outcome}`}`}>
          {result.error ? (
            <span>{result.message}</span>
          ) : (
            <>
              <div className="result-line">
                <strong>{result.order.order_number}</strong>
                <span className={`badge badge-${result.outcome}`}>{outcomeLabel[result.outcome]}</span>
              </div>
              {result.outcome === 'payment_failed' && (
                <div className="result-sub">reason: {result.reason} — stock was released automatically</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ConcurrencyLab({ products, onOrderSettled }) {
  const [productId, setProductId] = useState('');
  const [concurrency, setConcurrency] = useState(10);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState(null);

  const runTest = async (e) => {
    e.preventDefault();
    if (!productId) return;
    setBusy(true);
    setSummary(null);

    const before = products.find((p) => p.id === Number(productId));
    const n = Number(concurrency);

    const attempts = Array.from({ length: n }, (_, i) =>
      api
        .placeOrder({
          customerEmail: `race-${i}@example.com`,
          items: [{ productId: Number(productId), quantity: 1 }]
        })
        .then((r) => r.data)
        .catch((err) => ({ outcome: 'rejected', reason: err.message }))
    );

    const results = await Promise.all(attempts);

    const confirmed = results.filter((r) => r.outcome === 'confirmed').length;
    const paymentFailed = results.filter((r) => r.outcome === 'payment_failed').length;
    const rejected = results.filter((r) => r.outcome === 'rejected').length;

    setSummary({
      before,
      total: n,
      confirmed,
      paymentFailed,
      rejected
    });
    setBusy(false);
    onOrderSettled();
  };

  return (
    <div className="console-body">
      <form className="order-form" onSubmit={runTest}>
        <label>
          Target product
          <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="" disabled>
              pick something with low stock to see contention…
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sku} — {p.name} ({p.stock_quantity} left)
              </option>
            ))}
          </select>
        </label>

        <label>
          Simultaneous buyers
          <input
            type="number"
            min="2"
            max="200"
            value={concurrency}
            onChange={(e) => setConcurrency(e.target.value)}
          />
        </label>

        <button type="submit" className="primary-btn" disabled={busy}>
          {busy ? 'firing requests…' : `Fire ${concurrency} orders at once`}
        </button>
        <p className="hint-line">
          Every request hits <code>POST /api/orders</code> in parallel. Watch the transaction log — the invariant is
          that confirmed orders never exceed the stock that existed when the run started.
        </p>
      </form>

      {summary && (
        <div className="race-summary">
          <div className="race-row">
            <span>starting stock</span>
            <strong>{summary.before?.stock_quantity ?? '—'}</strong>
          </div>
          <div className="race-row">
            <span>requests fired</span>
            <strong>{summary.total}</strong>
          </div>
          <div className="race-row race-ok">
            <span>confirmed</span>
            <strong>{summary.confirmed}</strong>
          </div>
          <div className="race-row race-warn">
            <span>payment declined (stock released)</span>
            <strong>{summary.paymentFailed}</strong>
          </div>
          <div className="race-row race-bad">
            <span>rejected (out of stock / lock conflict)</span>
            <strong>{summary.rejected}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
