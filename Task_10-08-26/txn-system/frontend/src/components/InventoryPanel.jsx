import React from 'react';

function stockLevel(qty) {
  if (qty === 0) return 'out';
  if (qty <= 5) return 'low';
  return 'ok';
}

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

export default function InventoryPanel({ products, loading }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Inventory</h2>
        <span className="panel-hint">stock · version</span>
      </div>

      {loading && products.length === 0 ? (
        <div className="empty">reading products…</div>
      ) : (
        <ul className="inv-list">
          {products.map((p) => (
            <li key={p.id} className={`inv-row inv-${stockLevel(p.stock_quantity)}`}>
              <div className="inv-main">
                <span className="inv-sku">{p.sku}</span>
                <span className="inv-name">{p.name}</span>
              </div>
              <div className="inv-meta">
                <span className="inv-price">{money(p.price_cents)}</span>
                <span className="inv-stock">{p.stock_quantity} units</span>
                <span className="inv-version">v{p.version}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
