const Queue = require('bull');
const { REDIS_URL } = require('../config/redis');
const { DEFAULT_JOB_OPTIONS } = require('../utils/defaultJobOptions');

const imageQueue = new Queue('image-processing', REDIS_URL, {
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

module.exports = imageQueue;
