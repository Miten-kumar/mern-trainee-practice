// attempts: how many times bull will try a job before marking it
// permanently failed. backoff: how long to wait between retries -
// exponential means the wait doubles each time (2s, 4s, 8s...), so we
// don't hammer a service that's already struggling.
const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
  // keep the queue from growing forever in redis - completed jobs are
  // kept for a bit for the status endpoint to still work, then dropped
  removeOnComplete: 100,
  removeOnFail: 200,
};

module.exports = { DEFAULT_JOB_OPTIONS };
