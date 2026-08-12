import React, { useCallback, useEffect, useState } from 'react';
import { api } from './api/client.js';
import InventoryPanel from './components/InventoryPanel.jsx';
import OrderConsole from './components/OrderConsole.jsx';
import TransactionLog from './components/TransactionLog.jsx';

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connError, setConnError] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([api.listProducts(), api.listOrders(40)]);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
      setConnError(false);
    } catch (err) {
      setConnError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">OF</span>
          <div>
            <div className="brand-title">OrderFlow</div>
            <div className="brand-sub">transaction &amp; inventory ledger</div>
          </div>
        </div>
        <div className={`conn-pill ${connError ? 'conn-down' : 'conn-up'}`}>
          <span className="conn-dot" />
          {connError ? 'API unreachable' : 'live'}
        </div>
      </header>

      {connError && (
        <div className="banner">
          Can't reach the API at <code>/api</code>. Start the backend (<code>npm run dev</code> in{' '}
          <code>backend/</code>) and make sure PostgreSQL is running and migrated.
        </div>
      )}

      <main className="grid">
        <section className="col col-inventory">
          <InventoryPanel products={products} loading={loading} />
        </section>

        <section className="col col-console">
          <OrderConsole products={products} onOrderSettled={refresh} />
        </section>

        <section className="col col-log">
          <TransactionLog orders={orders} />
        </section>
      </main>
    </div>
  );
}
