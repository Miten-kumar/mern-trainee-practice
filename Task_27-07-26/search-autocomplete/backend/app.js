const express = require('express');
const cors = require('cors');
const searchRouter = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Search autocomplete API is running');
});

app.use('/api/search', searchRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

module.exports = app;
