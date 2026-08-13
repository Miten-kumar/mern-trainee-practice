import express from 'express';
import cors from 'cors';
import paymentRoutes from './src/routes/payment.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import sessionRoutes from './src/routes/session.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', sessionRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`checkout backend listening on http://localhost:${PORT}`);
});
