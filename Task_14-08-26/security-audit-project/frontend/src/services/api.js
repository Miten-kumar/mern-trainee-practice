/**
 * Thin fetch wrapper.
 *
 * AUDIT NOTE (finding SEC-02, token storage): the original frontend stored
 * the JWT in localStorage and attached it via `Authorization: Bearer`,
 * which is directly readable by any injected script (localStorage has no
 * httpOnly equivalent). Fixed: the token now lives in an httpOnly cookie
 * set by the server (see backend/src/controllers/authController.js) — this
 * file never touches it. `credentials: 'include'` sends the cookie
 * automatically; we only manage the CSRF token, which is SAFE to keep in
 * JS memory because it's useless to an attacker without also controlling
 * the httpOnly session cookie.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

let csrfToken = null;

async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  const res = await fetch(`${BASE_URL}/auth/csrf-token`, { credentials: 'include' });
  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

async function request(path, { method = 'GET', body } = {}) {
  const isMutating = method !== 'GET';
  const headers = { 'Content-Type': 'application/json' };
  if (isMutating) headers['X-CSRF-Token'] = await ensureCsrfToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include', // send the httpOnly session cookie
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 403 && isMutating) {
    // token may have gone stale (e.g. after login rotated the session) — refetch once
    csrfToken = null;
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  listPosts: () => request('/posts'),
  searchPosts: (q) => request(`/posts/search?q=${encodeURIComponent(q)}`),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (payload) => request('/posts', { method: 'POST', body: payload }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  addComment: (id, payload) => request(`/posts/${id}/comments`, { method: 'POST', body: payload }),
};
