exports.up = function (knex) {
  return knex.schema.createTable('inventory_ledger', (t) => {
    t.increments('id').primary();
    t.integer('product_id').unsigned().notNullable()
      .references('id').inTable('products').onDelete('CASCADE');
    t.integer('order_id').unsigned().nullable()
      .references('id').inTable('orders').onDelete('SET NULL');
    // 'reserve' | 'release' | 'restock'
    t.string('movement_type', 20).notNullable();
    t.integer('delta').notNullable();
    t.integer('resulting_stock').notNullable();
    t.integer('resulting_version').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());

    t.index(['product_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('inventory_ledger');
};
