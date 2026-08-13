// A tiny in-memory "database" — swap for Redis/Postgres/Mongo later without
// touching the routes, since they only ever call these functions.

const sessions = new Map(); // sessionId -> persisted xstate snapshot
const orders = new Map(); // orderId -> order record

export const sessionStore = {
  get(sessionId) {
    return sessions.get(sessionId) ?? null;
  },
  set(sessionId, snapshot) {
    sessions.set(sessionId, snapshot);
    return snapshot;
  },
  clear(sessionId) {
    return sessions.delete(sessionId);
  },
};

export const orderStore = {
  create(order) {
    orders.set(order.orderId, order);
    return order;
  },
  get(orderId) {
    return orders.get(orderId) ?? null;
  },
  list() {
    return Array.from(orders.values()).sort((a, b) => b.createdAt - a.createdAt);
  },
};
