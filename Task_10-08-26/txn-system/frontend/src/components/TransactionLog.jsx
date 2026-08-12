import React from 'react';

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

const statusMeta = {
  confirmed: { label: 'CONFIRMED', cls: 'log-ok' },
  pending: { label: 'PENDING', cls: 'log-pending' },
  payment_failed: { label: 'DECLINED', cls: 'log-bad' },
  cancelled: { label: 'CANCELLED', cls: 'log-bad' }
};

function timeOf(ts) {
  return new Date(ts).toLocaleTimeString([], { hour12: false });
}

export default function TransactionLog({ orders }) {
  return (
    <div className="panel panel-log">
      <div className="panel-head">
        <h2>Transaction log</h2>
        <span className="panel-hint">write-ahead order ledger</span>
      </div>

      <div className="log-feed">
        {orders.length === 0 && <div className="empty">no transactions yet — place an order to begin</div>}
        {orders.map((o) => {
          const meta = statusMeta[o.status] || { label: o.status.toUpperCase(), cls: '' };
          return (
            <div key={o.id} className={`log-line ${meta.cls}`}>
              <span className="log-time">{timeOf(o.created_at)}</span>
              <span className="log-hash">{o.order_number}</span>
              <span className="log-status">{meta.label}</span>
              <span className="log-amount">{money(o.total_cents)}</span>
              <span className="log-email">{o.customer_email}</span>
              {o.failure_reason && <span className="log-reason">{o.failure_reason}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
