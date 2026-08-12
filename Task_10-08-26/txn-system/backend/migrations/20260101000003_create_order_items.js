exports.up = function (knex) {
  return knex.schema.createTable('order_items', (t) => {
    t.increments('id').primary();
    t.integer('order_id').unsigned().notNullable()
      .references('id').inTable('orders').onDelete('CASCADE');
    t.integer('product_id').unsigned().notNullable()
      .references('id').inTable('products').onDelete('RESTRICT');
    t.integer('quantity').notNullable();
    t.integer('unit_price_cents').notNullable();
    t.timestamps(true, true);

    t.check('?? > 0', ['quantity']);
    t.index(['order_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('order_items');
};
