const Queue = require('bull');
const { REDIS_URL } = require('../config/redis');
const { DEFAULT_JOB_OPTIONS } = require('../utils/defaultJobOptions');

// this file only defines and exports the queue - it does NOT attach a
// processor. The api server uses this to add jobs, the worker process
// uses the same queue name to pick them up and process them. Keeping
// "add jobs" and "process jobs" in separate files/processes is what
// lets you scale workers independently from the api.
const emailQueue = new Queue('email-sending', REDIS_URL, {
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

module.exports = emailQueue;
