const express = require('express');
const cors = require('cors');
const imagesRouter = require('./routes/images');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Image gallery API is running');
});

app.use('/api/images', imagesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

module.exports = app;
