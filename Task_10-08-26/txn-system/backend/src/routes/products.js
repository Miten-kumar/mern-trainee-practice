const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await db('products').orderBy('id', 'asc');
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/ledger', async (req, res, next) => {
  try {
    const ledger = await db('inventory_ledger')
      .where({ product_id: req.params.id })
      .orderBy('created_at', 'desc')
      .limit(30);
    res.json(ledger);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
