const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const healthRouter = require('./routes/health');
const versionRouter = require('./routes/version');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/version', versionRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running' });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Central error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
