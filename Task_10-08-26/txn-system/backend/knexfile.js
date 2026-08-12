require('dotenv').config();

const base = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'orderflow'
  },
  pool: { min: 2, max: 10 },
  migrations: { directory: './migrations', tableName: 'knex_migrations' },
  seeds: { directory: './seeds' }
};

module.exports = {
  development: base,
  test: {
    ...base,
    connection: { ...base.connection, database: process.env.DB_NAME_TEST || 'orderflow_test' }
  },
  production: {
    ...base,
    connection: process.env.DATABASE_URL || base.connection,
    pool: { min: 2, max: 20 }
  }
};
