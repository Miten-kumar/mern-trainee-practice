const db = require('../db');
const logger = require('../utils/logger');
const { InsufficientStockError, OptimisticLockError, NotFoundError } = require('../errors');

const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 15;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Deducts stock for a single product using compare-and-swap on `version`.
 * Must be called inside an active knex transaction (`trx`).
 * Throws InsufficientStockError immediately (no point retrying that).
 * Throws OptimisticLockError only after MAX_RETRIES failed CAS attempts.
 */
async function deductStock(trx, { productId, quantity, orderId = null }) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const product = await trx('products').where({ id: productId }).first();
    if (!product) throw new NotFoundError('Product', productId);

    if (product.stock_quantity < quantity) {
      throw new InsufficientStockError(product.sku, quantity, product.stock_quantity);
    }

    const updatedRows = await trx('products')
      .where({ id: productId, version: product.version })
      .andWhere('stock_quantity', '>=', quantity)
      .update({
        stock_quantity: product.stock_quantity - quantity,
        version: product.version + 1,
        updated_at: trx.fn.now()
      });

    if (updatedRows === 1) {
      const updated = await trx('products').where({ id: productId }).first();

      await trx('inventory_ledger').insert({
        product_id: productId,
        order_id: orderId,
        movement_type: 'reserve',
        delta: -quantity,
        resulting_stock: updated.stock_quantity,
        resulting_version: updated.version
      });

      if (attempt > 1) {
        logger.info('optimistic_lock_resolved', { productId, attempt });
      }
      return updated;
    }

    // Someone else won the race on this row between our read and write.
    // Back off with jitter and re-read the latest version, then retry.
    logger.warn('optimistic_lock_conflict', { productId, attempt });
    await sleep(BASE_BACKOFF_MS * attempt + Math.random() * 20);
  }

  throw new OptimisticLockError(productId);
}

/**
 * Reverses a prior deduction, e.g. on payment failure or order cancellation.
 * Increments version too, since restoring stock is itself a write.
 */
async function restoreStock(trx, { productId, quantity, orderId = null }) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const product = await trx('products').where({ id: productId }).first();
    if (!product) throw new NotFoundError('Product', productId);

    const updatedRows = await trx('products')
      .where({ id: productId, version: product.version })
      .update({
        stock_quantity: product.stock_quantity + quantity,
        version: product.version + 1,
        updated_at: trx.fn.now()
      });

    if (updatedRows === 1) {
      const updated = await trx('products').where({ id: productId }).first();

      await trx('inventory_ledger').insert({
        product_id: productId,
        order_id: orderId,
        movement_type: 'release',
        delta: quantity,
        resulting_stock: updated.stock_quantity,
        resulting_version: updated.version
      });

      return updated;
    }

    await sleep(BASE_BACKOFF_MS * attempt + Math.random() * 20);
  }

  throw new OptimisticLockError(productId);
}

module.exports = { deductStock, restoreStock, MAX_RETRIES };
