require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');

const REQUIRED_ENV = ['JWT_SECRET', 'CSRF_SECRET', 'COOKIE_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  // Fail fast rather than boot with insecure defaults (finding SEC-11:
  // the original app fell back to a hardcoded JWT secret if .env was
  // missing, which is how a lot of real breaches happen).
  logger.error(`Missing required env vars: ${missing.join(', ')}. Copy .env.example to .env.`);
  process.exit(1);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`API listening on port ${PORT} (${process.env.NODE_ENV})`));
