/**
 * Concurrency / race-condition harness.
 *
 * Picks a low-stock product, fires N concurrent order requests for it at
 * the exact same time, then asserts the core invariant: the DB never goes
 * negative and the number of confirmed orders never exceeds the stock that
 * existed when the run started.
 *
 * Run with the API server already up:
 *   node tests/raceCondition.js --concurrency=15 --sku=HD-ANC2 --qty=1
 *
 * Or point it at a fresh product/quantity to try different contention levels.
 */
const axios = require('axios');
const db = require('../src/db');

const API_URL = process.env.API_URL || 'http://localhost:4000';

function parseArgs() {
  const args = { concurrency: 15, sku: 'HD-ANC2', qty: 1 };
  for (const raw of process.argv.slice(2)) {
    const [key, value] = raw.replace(/^--/, '').split('=');
    if (key === 'concurrency') args.concurrency = Number(value);
    if (key === 'sku') args.sku = value;
    if (key === 'qty') args.qty = Number(value);
  }
  return args;
}

async function fireOrder(productId, qty, i) {
  const start = Date.now();
  try {
    const { data } = await axios.post(`${API_URL}/api/orders`, {
      customerEmail: `race-tester-${i}@example.com`,
      items: [{ productId, quantity: qty }]
    });
    return { i, ms: Date.now() - start, outcome: data.outcome, orderId: data.order.id };
  } catch (err) {
    const body = err.response?.data?.error;
    return {
      i,
      ms: Date.now() - start,
      outcome: 'rejected',
      code: body?.code || 'UNKNOWN',
      message: body?.message || err.message
    };
  }
}

async function run() {
  const { concurrency, sku, qty } = parseArgs();

  const product = await db('products').where({ sku }).first();
  if (!product) {
    console.error(`No product with sku ${sku}. Seed the DB first (npm run seed).`);
    process.exit(1);
  }

  console.log(`\nRace test: ${concurrency} concurrent buyers, ${qty} unit(s) each, of "${product.name}"`);
  console.log(`Starting stock: ${product.stock_quantity} (version ${product.version})\n`);

  const requests = Array.from({ length: concurrency }, (_, i) => fireOrder(product.id, qty, i));
  const results = await Promise.all(requests);

  const confirmed = results.filter((r) => r.outcome === 'confirmed');
  const paymentFailed = results.filter((r) => r.outcome === 'payment_failed');
  const rejected = results.filter((r) => r.outcome === 'rejected');
  const outOfStock = rejected.filter((r) => r.code === 'INSUFFICIENT_STOCK');
  const lockExhausted = rejected.filter((r) => r.code === 'LOCK_CONFLICT');

  const finalProduct = await db('products').where({ id: product.id }).first();
  const unitsSold = confirmed.length * qty;
  const expectedStock = product.stock_quantity - unitsSold;

  console.log('--- results ---------------------------------------');
  console.log(`confirmed:        ${confirmed.length}`);
  console.log(`payment failed:   ${paymentFailed.length}  (stock auto-released)`);
  console.log(`out of stock:     ${outOfStock.length}`);
  console.log(`lock exhausted:   ${lockExhausted.length}  (raise --concurrency or check retry budget)`);
  console.log(`other rejections: ${rejected.length - outOfStock.length - lockExhausted.length}`);
  console.log('-----------------------------------------------------');
  console.log(`final stock in DB: ${finalProduct.stock_quantity} (version ${finalProduct.version})`);
  console.log(`expected stock:    ${expectedStock}`);

  const oversold = finalProduct.stock_quantity < 0;
  const mismatch = finalProduct.stock_quantity !== expectedStock;

  if (oversold) {
    console.log('\nFAIL: stock went negative - overselling occurred.');
  } else if (mismatch) {
    console.log('\nFAIL: final stock does not match confirmed-order math - check ledger.');
  } else {
    console.log('\nPASS: no overselling, stock accounting is exact under concurrency.');
  }

  const avgMs = Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length);
  console.log(`avg request latency: ${avgMs}ms\n`);

  await db.destroy();
  process.exit(oversold || mismatch ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
