# OrderFlow

A small order-processing engine built to show one thing well: how to move money
and inventory together without losing consistency when things go wrong or when
many requests land on the same row at once.

Stack: Node.js / Express / Knex / PostgreSQL on the backend, React (Vite) on the
frontend. No ORM magic — the transaction logic is plain SQL through Knex so it's
easy to reason about exactly what's happening inside each `BEGIN`/`COMMIT`.

## What it does

- Places an order against one or more products, deducting stock as part of the
  same operation.
- Runs a simulated payment authorization after inventory is reserved.
- If payment fails, automatically reverses the inventory it just reserved
  (a compensating transaction) and marks the order `payment_failed` instead of
  leaving stock stuck in limbo.
- Uses **optimistic locking** (a `version` column + compare-and-swap update) to
  handle concurrent orders on the same product, instead of holding row locks.
- Ships two concurrency test scripts and an in-browser "concurrency lab" that
  fire a batch of simultaneous orders at a low-stock product and verify the
  final stock count is exact — no overselling, no lost updates.

## Why two-phase instead of one big transaction

The naive version wraps inventory deduction, order creation, and the payment
call in a single DB transaction. That works until the payment gateway is slow —
now you're holding a Postgres transaction (and a connection out of the pool)
open for however long the network call to the payment provider takes. Under
load that's how a payments outage turns into a database outage.

Here it's split into two phases instead:

1. **`reserveOrder`** — one DB transaction. Validates the request, deducts
   stock for every line item using optimistic locking, creates the order and
   its line items. Commits or rolls back atomically; nothing external happens
   in here.
2. **`settlePayment`** — calls the (simulated) payment gateway *outside* any
   transaction. On success, a second short transaction marks the order
   confirmed and records the payment. On decline, a compensating transaction
   restores the stock, records the failed payment, and marks the order
   `payment_failed`.

Both phases end up consistent, but neither one holds a database transaction
open across a network call.

## Optimistic locking, concretely

Every product row has a `version` integer. A stock deduction is a single
`UPDATE`:

```sql
UPDATE products
SET stock_quantity = stock_quantity - :qty,
    version = version + 1
WHERE id = :id
  AND version = :expected_version
  AND stock_quantity >= :qty;
```

If another request updated the row first, `version` no longer matches and
the `UPDATE` affects zero rows. The caller reloads the row, checks whether the
*real* problem is insufficient stock (permanent — throw immediately) or just a
lost race (transient — retry with a small backoff, capped at 5 attempts). This
avoids row-level locks for the common case, at the cost of occasionally
re-doing a read+write under contention, which is the right trade for a
read-heavy storefront.

Every stock movement — reservation or release — also writes a row to
`inventory_ledger`, so you can audit exactly what happened to a product's
stock and when, independent of the orders table.

## Project layout
```
backend/
  migrations/          products, orders, order_items, payments, inventory_ledger
  src/
    services/
      inventoryService.js   optimistic-locking CAS loop (deduct / restore)
      orderService.js        reserveOrder + settlePayment orchestration
      paymentService.js      simulated gateway (latency + declines)
    routes/                  thin HTTP layer over the services
    errors.js                typed errors mapped to HTTP status codes
  tests/
    raceCondition.js         HTTP-level concurrency test
    optimisticLocking.js     in-process concurrency test (no HTTP layer)
frontend/
  src/
    components/
      InventoryPanel.jsx     live stock + version per product
      OrderConsole.jsx       place a single order / run the concurrency lab
      TransactionLog.jsx     WAL-style feed of order state transitions
```

## Running it

Requires PostgreSQL running locally (or point `.env` at any Postgres instance).

```bash
# backend
cd backend
cp .env.example .env    # adjust DB credentials if needed
npm install
npm run migrate
npm run seed
npm run dev              # http://localhost:4000

# frontend, in a second terminal
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## Testing the rollback and concurrency paths

Trigger a payment decline on demand: place an order for an amount that ends in
`.13` (any product priced so total lands on `x.13`, or just run the test
script below a few times — ~8% of payments decline randomly too). Check the
product's `stock_quantity` before and after: it should be unchanged once the
order settles into `payment_failed`.

Run the concurrency harnesses against the seeded data (the noise-cancelling
headset starts with 3 units in stock):

```bash
cd backend
npm run seed                                   # reset to known stock levels
node tests/raceCondition.js --concurrency=15 --sku=HD-ANC2 --qty=1
node tests/optimisticLocking.js --concurrency=25 --sku=MN-27UHD
```

Both print a pass/fail based on the same invariant: `final_stock ==
starting_stock - confirmed_orders`, and exit non-zero on mismatch, so they can
sit in CI. The same test is available from the UI under **concurrency lab** —
point it at a low-stock item and fire a batch of simultaneous buyers to watch
it play out in the transaction log in real time.


