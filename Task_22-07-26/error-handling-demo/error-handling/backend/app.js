const express = require('express');
const cors = require('cors');
const errorsRouter = require('./routes/errors');
const demoRouter = require('./routes/demo');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Error handling demo API is running');
});

app.use('/api/errors', errorsRouter);
app.use('/api/demo', demoRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

module.exports = app;
