import { Router } from 'express';
import { sessionStore } from '../store/memoryStore.js';

const router = Router();

// GET /api/checkout/session/:sessionId -> saved xstate snapshot, or null
router.get('/session/:sessionId', (req, res) => {
  const snapshot = sessionStore.get(req.params.sessionId);
  res.json({ snapshot });
});

// PUT /api/checkout/session/:sessionId -> save the current snapshot
router.put('/session/:sessionId', (req, res) => {
  const saved = sessionStore.set(req.params.sessionId, req.body.snapshot);
  res.json({ snapshot: saved });
});

// DELETE /api/checkout/session/:sessionId -> used by "reset demo"
router.delete('/session/:sessionId', (req, res) => {
  sessionStore.clear(req.params.sessionId);
  res.status(204).end();
});

export default router;
