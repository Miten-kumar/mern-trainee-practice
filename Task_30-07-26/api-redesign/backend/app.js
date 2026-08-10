const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const v1TasksRouter = require('./routes/v1/tasks');
const v2TasksRouter = require('./routes/v2/tasks');
const deprecationNotice = require('./middleware/deprecation');
const errorHandler = require('./utils/errorHandler');
const { NotFoundError } = require('./utils/errors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Task API is running',
    versions: {
      v1: { status: 'deprecated', base: '/api/v1/tasks' },
      v2: { status: 'current', base: '/api/v2/tasks' },
    },
    docs: '/api-docs',
  });
});

// v1 - kept for backwards compatibility, every response gets marked
// deprecated via headers (see middleware/deprecation.js)
app.use('/api/v1/tasks', deprecationNotice, v1TasksRouter);

// v2 - current version
app.use('/api/v2/tasks', v2TasksRouter);

// interactive OpenAPI docs, and the raw spec for tooling that wants it
const openapiDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.get('/openapi.json', (req, res) => res.json(openapiDocument));

// anything that didn't match a route above
app.use((req, res, next) => {
  next(new NotFoundError(`No route matches ${req.method} ${req.originalUrl}`, req.originalUrl));
});

app.use(errorHandler);

module.exports = app;
