const express = require('express');
const emailQueue = require('../queues/emailQueue');
const imageQueue = require('../queues/imageQueue');
const { mapPriority } = require('../utils/priority');

const router = express.Router();

const QUEUES = { email: emailQueue, image: imageQueue };

router.post('/email', async (req, res, next) => {
  try {
    const { to, subject, body, priority } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ message: 'to, subject and body are required' });
    }

    const job = await emailQueue.add({ to, subject, body }, { priority: mapPriority(priority) });

    res.status(201).json({ jobId: job.id, queue: 'email' });
  } catch (err) {
    next(err);
  }
});

router.post('/image', async (req, res, next) => {
  try {
    const { imageUrl, priority } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'imageUrl is required' });
    }

    const job = await imageQueue.add({ imageUrl }, { priority: mapPriority(priority) });

    res.status(201).json({ jobId: job.id, queue: 'image' });
  } catch (err) {
    next(err);
  }
});

// these two specific routes have to come before the generic
// "/:queueName/:id" route below, otherwise express would try to
// match "stats"/"failed" as a job id instead
router.get('/:queueName/stats', async (req, res, next) => {
  try {
    const queue = QUEUES[req.params.queueName];
    if (!queue) return res.status(400).json({ message: 'Unknown queue, use "email" or "image"' });

    const counts = await queue.getJobCounts();
    res.json({ queue: req.params.queueName, counts });
  } catch (err) {
    next(err);
  }
});

router.get('/:queueName/failed', async (req, res, next) => {
  try {
    const queue = QUEUES[req.params.queueName];
    if (!queue) return res.status(400).json({ message: 'Unknown queue, use "email" or "image"' });

    const failedJobs = await queue.getFailed();
    res.json({
      queue: req.params.queueName,
      failed: failedJobs.map((job) => ({
        id: job.id,
        data: job.data,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:queueName/:id', async (req, res, next) => {
  try {
    const queue = QUEUES[req.params.queueName];
    if (!queue) return res.status(400).json({ message: 'Unknown queue, use "email" or "image"' });

    const job = await queue.getJob(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const state = await job.getState();
    const progress = await job.progress();

    res.json({
      id: job.id,
      state,
      progress,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason || null,
      result: job.returnvalue || null,
      data: job.data,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
