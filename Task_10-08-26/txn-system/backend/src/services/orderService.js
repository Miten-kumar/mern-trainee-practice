const db = require('../db');
const logger = require('../utils/logger');
const inventoryService = require('./inventoryService');
const paymentService = require('./paymentService');
const { ValidationError, NotFoundError } = require('../errors');

function generateOrderNumber() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Order must contain at least one item');
  }
  for (const item of items) {
    if (!item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new ValidationError('Each item needs a productId and a positive integer quantity');
    }
  }
}

/**
 * Phase 1: reserve inventory and create the order atomically.
 * If any item is short on stock, or optimistic locking can't resolve a
 * conflict within the retry budget, the whole transaction rolls back -
 * no order is created and no stock is touched.
 */
async function reserveOrder({ customerEmail, items }) {
  validateItems(items);

  return db.transaction(async (trx) => {
    const productIds = items.map((i) => i.productId);
    const products = await trx('products').whereIn('id', productIds);
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      if (!productMap.has(item.productId)) {
        throw new NotFoundError('Product', item.productId);
      }
    }

    const orderNumber = generateOrderNumber();
    const totalCents = items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + product.price_cents * item.quantity;
    }, 0);

    const [order] = await trx('orders')
      .insert({
        order_number: orderNumber,
        customer_email: customerEmail,
        status: 'pending',
        total_cents: totalCents
      })
      .returning('*');

    // Deduct stock item-by-item. Each call is its own optimistic-locking
    // CAS loop; a failure here throws and knex rolls back everything above.
    for (const item of items) {
      const product = productMap.get(item.productId);
      await inventoryService.deductStock(trx, {
        productId: item.productId,
        quantity: item.quantity,
        orderId: order.id
      });

      await trx('order_items').insert({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price_cents: product.price_cents
      });
    }

    return order;
  });
}

/**
 * Phase 2: talk to the payment gateway *outside* the DB transaction so a
 * slow external call never holds row locks or an open connection hostage.
 * On success, confirm the order. On decline, run the compensating
 * transaction that releases the reserved stock and marks the order failed.
 */
async function settlePayment(order) {
  try {
    const auth = await paymentService.authorize({
      amountCents: order.total_cents,
      customerEmail: order.customer_email
    });

    await db.transaction(async (trx) => {
      await trx('payments').insert({
        order_id: order.id,
        amount_cents: order.total_cents,
        status: 'succeeded',
        provider_ref: auth.providerRef
      });
      await trx('orders').where({ id: order.id }).update({
        status: 'confirmed',
        updated_at: trx.fn.now()
      });
    });

    logger.info('order_confirmed', { orderId: order.id, orderNumber: order.order_number });
    return { status: 'confirmed' };
  } catch (err) {
    await compensateFailedPayment(order, err);
    throw err;
  }
}

async function compensateFailedPayment(order, err) {
  const reason = err.reason || err.message || 'payment_failed';

  await db.transaction(async (trx) => {
    const items = await trx('order_items').where({ order_id: order.id });

    for (const item of items) {
      await inventoryService.restoreStock(trx, {
        productId: item.product_id,
        quantity: item.quantity,
        orderId: order.id
      });
    }

    await trx('payments').insert({
      order_id: order.id,
      amount_cents: order.total_cents,
      status: 'declined',
      decline_reason: reason
    });

    await trx('orders').where({ id: order.id }).update({
      status: 'payment_failed',
      failure_reason: reason,
      updated_at: trx.fn.now()
    });
  });

  logger.warn('order_payment_failed_compensated', { orderId: order.id, reason });
}

/**
 * Full flow used by the API: reserve -> pay -> confirm or compensate.
 * Returns the final order row plus a machine-readable outcome.
 */
async function placeOrder({ customerEmail, items }) {
  const order = await reserveOrder({ customerEmail, items });

  try {
    await settlePayment(order);
  } catch (err) {
    // reserveOrder succeeded, payment failed, compensation already ran
    // inside settlePayment - surface the final state rather than throwing
    // a raw 500 to the caller.
    const finalOrder = await db('orders').where({ id: order.id }).first();
    return { order: finalOrder, outcome: 'payment_failed', reason: err.reason || err.message };
  }

  const finalOrder = await db('orders').where({ id: order.id }).first();
  return { order: finalOrder, outcome: 'confirmed' };
}

async function getOrder(orderId) {
  const order = await db('orders').where({ id: orderId }).first();
  if (!order) throw new NotFoundError('Order', orderId);

  const items = await db('order_items').where({ order_id: orderId });
  const payments = await db('payments').where({ order_id: orderId });
  return { ...order, items, payments };
}

async function listOrders({ limit = 50 } = {}) {
  return db('orders').orderBy('created_at', 'desc').limit(limit);
}

module.exports = { placeOrder, reserveOrder, settlePayment, getOrder, listOrders };
