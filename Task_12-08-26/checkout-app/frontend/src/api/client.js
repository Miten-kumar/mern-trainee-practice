const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Request failed: ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  charge: ({ items, shipping, simulateFailure }) =>
    request('/api/payment/charge', {
      method: 'POST',
      body: JSON.stringify({ items, shipping, simulateFailure }),
    }),

  getSession: (sessionId) => request(`/api/checkout/session/${sessionId}`),

  saveSession: (sessionId, snapshot) =>
    request(`/api/checkout/session/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify({ snapshot }),
    }),

  clearSession: (sessionId) =>
    request(`/api/checkout/session/${sessionId}`, { method: 'DELETE' }),
};
