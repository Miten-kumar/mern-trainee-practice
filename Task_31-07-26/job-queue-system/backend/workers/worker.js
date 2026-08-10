const emailQueue = require('../queues/emailQueue');
const imageQueue = require('../queues/imageQueue');
const processEmailJob = require('../processors/emailProcessor');
const processImageJob = require('../processors/imageProcessor');

// how many jobs THIS process handles at the same time, per queue.
// Bumping this handles more load without adding another process.
// Running `npm run worker` again in a second terminal (or on a second
// machine, pointed at the same redis) is how you scale out to more
// processes - bull coordinates through redis so they never double up
// on the same job.
const CONCURRENCY = Number(process.env.WORKER_CONCURRENCY) || 2;

emailQueue.process(CONCURRENCY, processEmailJob);
imageQueue.process(CONCURRENCY, processImageJob);

console.log(`Worker started (pid ${process.pid}), concurrency ${CONCURRENCY} per queue`);

emailQueue.on('completed', (job) => console.log(`[email] job ${job.id} completed`));
emailQueue.on('failed', (job, err) => console.log(`[email] job ${job.id} failed: ${err.message}`));
emailQueue.on('progress', (job, progress) => console.log(`[email] job ${job.id} progress ${progress}%`));

imageQueue.on('completed', (job) => console.log(`[image] job ${job.id} completed`));
imageQueue.on('failed', (job, err) => console.log(`[image] job ${job.id} failed: ${err.message}`));
imageQueue.on('progress', (job, progress) => console.log(`[image] job ${job.id} progress ${progress}%`));

// graceful shutdown - let whatever job is currently running finish
// instead of killing it mid-way when the process gets a stop signal
process.on('SIGTERM', async () => {
  console.log('Worker shutting down, waiting for active jobs to finish...');
  await emailQueue.close();
  await imageQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Worker shutting down, waiting for active jobs to finish...');
  await emailQueue.close();
  await imageQueue.close();
  process.exit(0);
});
