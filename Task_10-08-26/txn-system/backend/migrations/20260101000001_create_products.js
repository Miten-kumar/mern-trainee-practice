exports.up = function (knex) {
  return knex.schema.createTable('products', (t) => {
    t.increments('id').primary();
    t.string('sku', 40).notNullable().unique();
    t.string('name', 200).notNullable();
    t.integer('price_cents').notNullable();
    t.integer('stock_quantity').notNullable().defaultTo(0);
    t.integer('reserved_quantity').notNullable().defaultTo(0);
    // optimistic locking token - bumped on every write, checked on every write
    t.integer('version').notNullable().defaultTo(1);
    t.timestamps(true, true);

    t.check('?? >= 0', ['stock_quantity']);
    t.check('?? >= 0', ['reserved_quantity']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('products');
};
