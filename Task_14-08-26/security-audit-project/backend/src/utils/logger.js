const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

// Never let a logging call throw and take the process down with it.
process.on('unhandledRejection', (reason) => logger.error({ unhandledRejection: reason }));

module.exports = logger;
