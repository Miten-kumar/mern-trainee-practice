const STEPS = ['resizing', 'compressing', 'uploading', 'finalizing'];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// simulates a multi-step image pipeline (a real one would use
// something like sharp). Reports progress after every step so a
// client polling the status endpoint sees it move in increments
// instead of jumping straight from 0 to 100.
async function processImageJob(job) {
  const { imageUrl } = job.data;

  for (let i = 0; i < STEPS.length; i++) {
    await wait(250);

    const percentDone = Math.round(((i + 1) / STEPS.length) * 100);
    await job.progress(percentDone);

    // simulate a step failing partway through (corrupt file, storage
    // timeout, etc) - about 25% of the time, only checked once so a
    // retry gets a genuinely fresh chance
    if (i === 1 && Math.random() < 0.25) {
      throw new Error(`Image processing failed during "${STEPS[i]}" step for ${imageUrl}`);
    }
  }

  return {
    processedUrl: `${imageUrl}?processed=true`,
    steps: STEPS,
    finishedAt: new Date().toISOString(),
  };
}

module.exports = processImageJob;
