import { api } from '../api/client';

const SESSION_ID_KEY = 'checkout-session-id';

// Only a small opaque id lives in localStorage — the actual checkout state
// (cart, shipping, payment progress) is persisted server-side against it,
// so the same session can in principle be resumed on another device.
export function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

export async function fetchSnapshot(sessionId) {
  try {
    const { snapshot } = await api.getSession(sessionId);
    return snapshot ?? undefined;
  } catch (e) {
    console.warn('Could not load saved checkout session', e);
    return undefined;
  }
}

export async function saveSnapshot(sessionId, snapshot) {
  try {
    await api.saveSession(sessionId, snapshot);
  } catch (e) {
    console.warn('Could not persist checkout session', e);
  }
}

export async function clearSnapshot(sessionId) {
  try {
    await api.clearSession(sessionId);
  } catch (e) {
    /* noop */
  }
  localStorage.removeItem(SESSION_ID_KEY);
}
