const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(() => null);
  if (!res.ok && !data) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return { ok: res.ok, status: res.status, data };
}

export const api = {
  listProducts: () => request('/products'),
  productLedger: (id) => request(`/products/${id}/ledger`),
  listOrders: (limit = 30) => request(`/orders?limit=${limit}`),
  placeOrder: (payload) =>
    request('/orders', { method: 'POST', body: JSON.stringify(payload) })
};
