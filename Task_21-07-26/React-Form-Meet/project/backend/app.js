const express = require('express');
const cors = require('cors');
const applicationsRouter = require('./routes/applications');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Job application API is running');
});

app.use('/api/applications', applicationsRouter);

// basic error handler (mostly for multer errors like file too big / wrong type)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ message: err.message || 'Something went wrong' });
});

module.exports = app;
