exports.seed = async function (knex) {
  await knex('inventory_ledger').del();
  await knex('payments').del();
  await knex('order_items').del();
  await knex('orders').del();
  await knex('products').del();

  await knex('products').insert([
    { sku: 'KB-2060', name: 'Mechanical Keyboard - 60%', price_cents: 8999, stock_quantity: 12, version: 1 },
    { sku: 'MS-ERG1', name: 'Ergonomic Vertical Mouse', price_cents: 4499, stock_quantity: 25, version: 1 },
    { sku: 'MN-27UHD', name: '27" 4K Monitor', price_cents: 32999, stock_quantity: 6, version: 1 },
    { sku: 'HD-ANC2', name: 'Noise Cancelling Headset', price_cents: 15999, stock_quantity: 3, version: 1 },
    { sku: 'DK-STND', name: 'Adjustable Laptop Stand', price_cents: 3299, stock_quantity: 40, version: 1 }
  ]);
};
