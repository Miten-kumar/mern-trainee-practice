const { failure } = require('../utils/apiResponse');

function notFoundHandler(req, res, next) {
  failure(res, { message: `Route not found: ${req.method} ${req.originalUrl}`, status: 404 });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err.stack || err);
  const status = err.status || 500;
  failure(res, {
    message: err.message || 'Internal server error',
    status,
    errors: err.errors || []
  });
}

module.exports = { notFoundHandler, errorHandler };
