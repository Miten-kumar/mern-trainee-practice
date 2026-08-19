/**
 * Rate limiting.
 *
 * AUDIT NOTE (finding SEC-07): /api/auth/login had no throttling, making
 * credential-stuffing and brute-force attacks trivial. Two limiters:
 *   - a strict one for auth endpoints
 *   - a looser general one for the rest of the API
 * Account lockout (see User.recordFailedLogin) is layered on top so a
 * distributed attack across many IPs still gets slowed per-account.
 */

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Slow down.' },
});

module.exports = { authLimiter, apiLimiter };
