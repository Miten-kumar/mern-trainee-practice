const logger = require('../utils/logger');
const { AppError } = require('../errors');

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof AppError) {
    logger.warn('handled_error', { code: err.code, message: err.message, path: req.path });
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message }
    });
  }

  logger.error('unhandled_error', { message: err.message, stack: err.stack, path: req.path });
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong processing that request' }
  });
}

module.exports = errorHandler;
