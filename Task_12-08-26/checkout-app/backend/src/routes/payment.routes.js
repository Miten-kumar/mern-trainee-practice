import { Router } from 'express';
import { orderStore } from '../store/memoryStore.js';

const router = Router();

const DECLINE_REASONS = [
  'Card declined by issuing bank',
  'Payment gateway timeout',
  'Insufficient funds',
  'CVV verification failed',
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeOrderId() {
  return 'ORD-' + Math.random().toString(36).slice(2, 9).toUpperCase();
}

// POST /api/payment/charge
// body: { items, shipping, simulateFailure }
// The card number/CVV itself never needs to reach here for a real integration
// (that's what client-side tokenization via Stripe/Razorpay is for) — this
// endpoint only needs to know how much to charge and where to ship it.
router.post('/charge', async (req, res) => {
  const { items = [], shipping = {}, simulateFailure = false } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty' });
  }

  // simulate a real network round-trip to a payment gateway
  await delay(1200 + Math.random() * 600);

  const randomDecline = Math.random() < 0.25;
  if (simulateFailure || randomDecline) {
    const error = DECLINE_REASONS[Math.floor(Math.random() * DECLINE_REASONS.length)];
    return res.status(402).json({ success: false, error });
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = {
    orderId: makeOrderId(),
    items,
    shipping,
    total,
    createdAt: Date.now(),
  };
  orderStore.create(order);

  return res.status(200).json({ success: true, orderId: order.orderId, order });
});

export default router;
