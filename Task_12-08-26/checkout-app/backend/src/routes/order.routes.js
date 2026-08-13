import { Router } from 'express';
import { orderStore } from '../store/memoryStore.js';

const router = Router();

// GET /api/orders/:orderId
router.get('/:orderId', (req, res) => {
  const order = orderStore.get(req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// GET /api/orders
router.get('/', (_req, res) => {
  res.json(orderStore.list());
});

export default router;
