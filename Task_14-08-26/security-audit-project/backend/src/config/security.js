/**
 * Central place for security-related config so values aren't scattered
 * (and so a reviewer can audit them in one file).
 *
 * AUDIT NOTE (finding SEC-05): security headers were entirely absent in the
 * original app (no helmet, default Express "X-Powered-By" leaking the
 * framework/version). Fixed centrally here and wired up in app.js.
 */

const helmet = require('helmet');

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

const corsOptions = {
  origin(origin, callback) {
    // allow same-origin / non-browser tools (no origin header) and whitelisted origins only
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};

// Strict CSP: no inline scripts, no wildcard sources. This is what actually
// stops stored-XSS payloads from executing even if one slips through
// output encoding somewhere.
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // relax only for CSS-in-JS if needed
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"], // clickjacking protection, belt-and-braces with X-Frame-Options
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // avoid breaking third-party widgets; revisit if not needed
  referrerPolicy: { policy: 'no-referrer' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

module.exports = { corsOptions, helmetConfig, allowedOrigins };
