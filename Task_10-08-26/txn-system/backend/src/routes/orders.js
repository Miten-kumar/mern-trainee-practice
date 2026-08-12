const express = require('express');
const orderService = require('../services/orderService');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { customerEmail, items } = req.body;
    const result = await orderService.placeOrder({ customerEmail, items });

    const httpStatus = result.outcome === 'confirmed' ? 201 : 402;
    res.status(httpStatus).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const orders = await orderService.listOrders({ limit });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
