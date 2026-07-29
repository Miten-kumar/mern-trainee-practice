const express = require('express');
const items = require('../data/items');

const router = express.Router();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();

  if (!q) {
    return res.json({ results: [] });
  }

  // simulate a real network delay (100-400ms) so cancellation and
  // loading states actually have something to demonstrate against
  await wait(100 + Math.random() * 300);

  const matches = items.filter((item) => item.name.toLowerCase().includes(q));

  // names that start with the query feel more relevant, show those first
  matches.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(q);
    const bStarts = b.name.toLowerCase().startsWith(q);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.name.localeCompare(b.name);
  });

  res.json({ results: matches.slice(0, 8) });
});

module.exports = router;
