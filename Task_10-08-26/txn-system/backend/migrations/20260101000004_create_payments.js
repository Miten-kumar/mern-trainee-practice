exports.up = function (knex) {
  return knex.schema.createTable('payments', (t) => {
    t.increments('id').primary();
    t.integer('order_id').unsigned().notNullable()
      .references('id').inTable('orders').onDelete('CASCADE');
    t.integer('amount_cents').notNullable();
    // pending -> succeeded / declined
    t.string('status', 20).notNullable().defaultTo('pending');
    t.string('provider_ref', 60).nullable();
    t.text('decline_reason').nullable();
    t.timestamps(true, true);

    t.index(['order_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('payments');
};
