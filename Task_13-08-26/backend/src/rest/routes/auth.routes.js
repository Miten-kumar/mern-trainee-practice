const express = require('express');
const { register, login } = require('../../auth/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    const result = await register(req.dbStats, { name, email, password });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const result = await login(req.dbStats, { email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
