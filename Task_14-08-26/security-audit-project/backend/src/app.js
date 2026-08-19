const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { corsOptions, helmetConfig } = require('./config/security');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// AUDIT NOTE: app.disable('x-powered-by') + helmet removes/replaces the
// default Express fingerprinting headers (finding SEC-05).
app.disable('x-powered-by');
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json({ limit: '100kb' })); // capped body size, mitigates trivial DoS via huge payloads
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
