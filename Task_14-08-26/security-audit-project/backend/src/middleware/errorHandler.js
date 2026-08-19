/**
 * Centralized error handler.
 *
 * AUDIT NOTE (finding SEC-09, A09:2021 Security Logging/Monitoring +
 * information disclosure): the original app let unhandled errors bubble up
 * to Express's default handler, which returns full stack traces to the
 * client in some configs and logs nothing useful for detection. Fixed:
 *   - generic message to the client, full detail to server logs only
 *   - every error gets a correlation id so a user can report "error abc123"
 *     without ever leaking internals
 */

const { randomUUID } = require('crypto');
const logger = require('../utils/logger');

function notFound(req, res) {
  res.status(404).json({ error: 'Resource not found.' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const correlationId = randomUUID();
  logger.error({
    correlationId,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const status = err.status || 500;
  const clientMessage =
    status < 500 ? err.message : 'Something went wrong. Please try again.';

  res.status(status).json({ error: clientMessage, correlationId });
}

module.exports = { notFound, errorHandler };
