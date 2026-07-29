const express = require('express');

const router = express.Router();

// straightforward endpoint, basically always works, used for the
// "profile" widget so not everything on the page is broken
router.get('/profile', (req, res) => {
  res.json({ name: 'Priya Sharma', role: 'Frontend Trainee', joined: '2026-01-10' });
});

// fails about 50% of the time with a 503, so the frontend retry
// mechanism actually has something to retry against
router.get('/stats', (req, res) => {
  const shouldFail = Math.random() < 0.5;
  if (shouldFail) {
    return res.status(503).json({ message: 'Stats service temporarily unavailable' });
  }
  res.json({ visits: 1204, signups: 38, activeUsers: 512 });
});

// always fails with a 404, used to demo an error that should NOT be
// retried (retrying a 404 will never succeed)
router.get('/missing-resource', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

module.exports = router;
