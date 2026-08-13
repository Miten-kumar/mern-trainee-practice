import { setup, assign, fromPromise } from 'xstate';
import { api } from '../api/client';

// ---- Catalog (static demo data) ----
export const CATALOG = [
  { id: 'p1', name: 'Node One — Wireless Earbuds', price: 4499, image: '🎧' },
  { id: 'p2', name: 'Orbit Charging Dock', price: 1299, image: '🔌' },
  { id: 'p3', name: 'Braid USB-C Cable 2m', price: 399, image: '🧵' },
];

const initialContext = {
  items: [{ ...CATALOG[0], qty: 1 }],
  shipping: { name: '', address: '', city: '', zip: '', phone: '' },
  payment: { cardName: '', cardNumber: '', expiry: '', cvv: '' },
  simulateFailure: false,
  retryCount: 0,
  maxRetries: 3,
  error: null,
  orderId: null,
};

function cartTotal(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// Calls the real backend. The gateway delay + decline simulation now lives
// server-side (see backend/src/routes/payment.routes.js) — the frontend just
// awaits the response and reacts to success/failure.
const chargeCard = fromPromise(async ({ input }) => {
  try {
    const result = await api.charge(input);
    return result; // { success: true, orderId, order }
  } catch (err) {
    // client.js throws with the server's { error } message attached
    throw new Error(err.message || 'Payment failed');
  }
});

export const checkoutMachine = setup({
  types: {
    context: {},
    events: {},
  },
  actors: { chargeCard },
  guards: {
    cartNotEmpty: ({ context }) => context.items.length > 0,
    shippingValid: ({ context }) => {
      const s = context.shipping;
      return !!(s.name && s.address && s.city && s.zip && s.phone);
    },
    paymentValid: ({ context }) => {
      const p = context.payment;
      return !!(p.cardName && p.cardNumber.replace(/\s/g, '').length >= 12 && p.expiry && p.cvv.length >= 3);
    },
    canRetry: ({ context }) => context.retryCount < context.maxRetries,
    maxRetriesReached: ({ context }) => context.retryCount >= context.maxRetries,
  },
  actions: {
    updateItems: assign({
      items: ({ context, event }) => {
        if (event.type === 'ADD_ITEM') {
          const exists = context.items.find((i) => i.id === event.item.id);
          if (exists) {
            return context.items.map((i) =>
              i.id === event.item.id ? { ...i, qty: i.qty + 1 } : i
            );
          }
          return [...context.items, { ...event.item, qty: 1 }];
        }
        if (event.type === 'REMOVE_ITEM') {
          return context.items.filter((i) => i.id !== event.id);
        }
        if (event.type === 'SET_QTY') {
          return context.items
            .map((i) => (i.id === event.id ? { ...i, qty: Math.max(1, event.qty) } : i))
            .filter((i) => i.qty > 0);
        }
        return context.items;
      },
    }),
    updateShippingField: assign({
      shipping: ({ context, event }) => ({ ...context.shipping, [event.field]: event.value }),
    }),
    updatePaymentField: assign({
      payment: ({ context, event }) => ({ ...context.payment, [event.field]: event.value }),
    }),
    toggleSimulateFailure: assign({
      simulateFailure: ({ context }) => !context.simulateFailure,
    }),
    incrementRetry: assign({ retryCount: ({ context }) => context.retryCount + 1 }),
    resetRetry: assign({ retryCount: 0, error: null }),
    setError: assign({ error: ({ event }) => event.error?.message || 'Payment failed' }),
    setOrderId: assign({ orderId: ({ event }) => event.output.orderId }),
    resetOrder: assign(() => ({ ...initialContext })),
  },
}).createMachine({
  id: 'checkout',
  initial: 'cart',
  context: initialContext,
  states: {
    cart: {
      on: {
        ADD_ITEM: { actions: 'updateItems' },
        REMOVE_ITEM: { actions: 'updateItems' },
        SET_QTY: { actions: 'updateItems' },
        NEXT: { target: 'shipping', guard: 'cartNotEmpty' },
      },
    },
    shipping: {
      on: {
        UPDATE_FIELD: { actions: 'updateShippingField' },
        BACK: 'cart',
        NEXT: { target: 'payment', guard: 'shippingValid' },
      },
    },
    payment: {
      on: {
        UPDATE_FIELD: { actions: 'updatePaymentField' },
        TOGGLE_SIMULATE_FAILURE: { actions: 'toggleSimulateFailure' },
        BACK: 'shipping',
        NEXT: { target: 'processingPayment', guard: 'paymentValid' },
      },
    },
    processingPayment: {
      invoke: {
        src: 'chargeCard',
        input: ({ context }) => ({
          items: context.items,
          shipping: context.shipping,
          simulateFailure: context.simulateFailure,
        }),
        onDone: {
          target: 'confirmation',
          actions: 'setOrderId',
        },
        onError: {
          target: 'paymentError',
          actions: ['setError', 'incrementRetry'],
        },
      },
    },
    paymentError: {
      always: [{ target: 'paymentFailed', guard: 'maxRetriesReached' }],
      on: {
        RETRY: { target: 'processingPayment', guard: 'canRetry' },
        EDIT_PAYMENT: { target: 'payment', actions: 'resetRetry' },
      },
    },
    paymentFailed: {
      on: {
        START_OVER: { target: 'payment', actions: 'resetRetry' },
        BACK_TO_CART: { target: 'cart', actions: 'resetOrder' },
      },
    },
    confirmation: {
      on: {
        NEW_ORDER: { target: 'cart', actions: 'resetOrder' },
      },
    },
  },
});

export { cartTotal };
