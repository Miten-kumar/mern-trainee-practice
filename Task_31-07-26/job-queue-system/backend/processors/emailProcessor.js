function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// simulates sending an email through a provider like SendGrid/SES.
// fails about 20% of the time on purpose so the retry mechanism (see
// utils/defaultJobOptions.js) actually has something to do when you
// run this for real.
async function processEmailJob(job) {
  const { to, subject } = job.data;

  await job.progress(10);
  await wait(300);

  await job.progress(50);
  await wait(300);

  if (Math.random() < 0.2) {
    throw new Error(`Failed to send email to ${to} (simulated provider error)`);
  }

  await job.progress(100);

  return { sentTo: to, subject, sentAt: new Date().toISOString() };
}

module.exports = processEmailJob;
