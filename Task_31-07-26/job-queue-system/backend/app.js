const express = require('express');
const cors = require('cors');
const jobsRouter = require('./routes/jobs');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Job queue API is running');
});

app.use('/api/jobs', jobsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

module.exports = app;
