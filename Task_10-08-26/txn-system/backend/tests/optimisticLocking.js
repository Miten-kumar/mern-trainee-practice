/**
 * Lower-level than raceCondition.js: calls orderService.reserveOrder()
 * directly, in-process, with no HTTP/network layer in between. This isolates
 * whether the CAS loop in inventoryService itself is correct under true
 * simultaneous DB transactions, independent of API/connection-pool timing.
 *
 * node tests/optimisticLocking.js --concurrency=25 --sku=MN-27UHD
 */
const db = require('../src/db');
const orderService = require('../src/services/orderService');

function parseArgs() {
  const args = { concurrency: 25, sku: 'MN-27UHD' };
  for (const raw of process.argv.slice(2)) {
    const [key, value] = raw.replace(/^--/, '').split('=');
    if (key === 'concurrency') args.concurrency = Number(value);
    if (key === 'sku') args.sku = value;
  }
  return args;
}

async function run() {
  const { concurrency, sku } = parseArgs();
  const product = await db('products').where({ sku }).first();
  if (!product) {
    console.error(`No product with sku ${sku}. Run npm run seed first.`);
    process.exit(1);
  }

  console.log(`\nDirect CAS test: ${concurrency} simultaneous reservations against "${product.name}"`);
  console.log(`starting stock ${product.stock_quantity}, version ${product.version}\n`);

  const attempts = Array.from({ length: concurrency }, (_, i) =>
    orderService
      .reserveOrder({ customerEmail: `direct-${i}@example.com`, items: [{ productId: product.id, quantity: 1 }] })
      .then(() => ({ ok: true }))
      .catch((err) => ({ ok: false, code: err.code || 'ERROR' }))
  );

  const results = await Promise.all(attempts);
  const succeeded = results.filter((r) => r.ok).length;
  const insufficientStock = results.filter((r) => r.code === 'INSUFFICIENT_STOCK').length;
  const lockConflict = results.filter((r) => r.code === 'LOCK_CONFLICT').length;

  const finalProduct = await db('products').where({ id: product.id }).first();

  console.log(`reserved successfully: ${succeeded}`);
  console.log(`blocked (out of stock): ${insufficientStock}`);
  console.log(`blocked (lock retries exhausted): ${lockConflict}`);
  console.log(`final stock: ${finalProduct.stock_quantity} (expected ${product.stock_quantity - succeeded})`);
  console.log(`final version: ${finalProduct.version} (expected ${product.version + succeeded})\n`);

  const ok =
    finalProduct.stock_quantity === product.stock_quantity - succeeded &&
    finalProduct.version === product.version + succeeded &&
    finalProduct.stock_quantity >= 0;

  console.log(ok ? 'PASS: version and stock accounting exact under contention.' : 'FAIL: mismatch detected.');

  await db.destroy();
  process.exit(ok ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
