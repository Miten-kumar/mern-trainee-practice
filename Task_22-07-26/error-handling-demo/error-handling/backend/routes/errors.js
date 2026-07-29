const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'errors.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function readErrors() {
  if (!fs.existsSync(dataFile)) return [];
  return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
}

function writeErrors(errors) {
  fs.writeFileSync(dataFile, JSON.stringify(errors, null, 2));
}

// frontend sends caught errors here so we have a record of what broke,
// even though it's just a json file for this project
router.post('/', (req, res) => {
  const { message, type, stack, componentStack, url, timestamp } = req.body;

  if (!message || !type) {
    return res.status(400).json({ message: 'message and type are required' });
  }

  const errors = readErrors();
  const entry = {
    id: Date.now(),
    message,
    type,
    stack: stack || null,
    componentStack: componentStack || null,
    url: url || null,
    timestamp: timestamp || new Date().toISOString(),
  };

  errors.push(entry);
  writeErrors(errors);

  res.status(201).json({ message: 'logged', id: entry.id });
});

// small aggregate view, could be used for a real analytics dashboard later
router.get('/stats', (req, res) => {
  const errors = readErrors();
  const counts = {};
  errors.forEach((e) => {
    counts[e.type] = (counts[e.type] || 0) + 1;
  });
  res.json({ total: errors.length, byType: counts });
});

module.exports = router;
