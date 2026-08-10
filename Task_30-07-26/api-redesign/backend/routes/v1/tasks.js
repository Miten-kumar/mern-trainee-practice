const express = require('express');
const store = require('../../data/tasks');

const router = express.Router();

// note: this is deliberately the "old" style - flat json, no HATEOAS
// links, an ad hoc { message } error shape instead of the consistent
// problem+json format v2 uses. That inconsistency is exactly what v2
// was designed to fix, kept here so there's something real to
// compare against.

router.get('/', (req, res) => {
  res.json(store.getAll());
});

router.get('/:id', (req, res) => {
  const task = store.getById(Number(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'title is required' });

  const task = store.create(req.body);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const task = store.update(Number(req.params.id), req.body);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

router.delete('/:id', (req, res) => {
  const removed = store.remove(Number(req.params.id));
  if (!removed) return res.status(404).json({ message: 'Task not found' });
  res.status(204).send();
});

module.exports = router;
