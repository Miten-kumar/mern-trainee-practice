exports.up = function (knex) {
  return knex.schema.createTable('orders', (t) => {
    t.increments('id').primary();
    t.string('order_number', 24).notNullable().unique();
    t.string('customer_email', 200).notNullable();
    // pending -> confirmed -> completed, or pending -> failed / cancelled
    t.string('status', 20).notNullable().defaultTo('pending');
    t.integer('total_cents').notNullable();
    t.text('failure_reason').nullable();
    t.integer('version').notNullable().defaultTo(1);
    t.timestamps(true, true);

    t.index(['status']);
    t.index(['customer_email']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('orders');
};
