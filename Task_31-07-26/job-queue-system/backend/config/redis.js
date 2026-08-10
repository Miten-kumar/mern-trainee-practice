// single place for the redis connection settings, both the api server
// and the worker process import this so they always point at the
// same redis instance
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

module.exports = { REDIS_URL };
