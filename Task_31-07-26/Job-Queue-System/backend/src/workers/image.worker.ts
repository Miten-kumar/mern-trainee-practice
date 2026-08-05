import { Job } from "bull";

import { imageQueue } from "../queues/image.queue";
import prisma from "../config/prisma";
import { processImage } from "../services/image.service";
import { ImageJobData } from "../types/job.types";
import { logger } from "../utils/logger";

logger.info("Image Worker Started");

imageQueue.process(3, async (job: Job<ImageJobData>) => {
  try {
    await prisma.job.update({
      where: {
        jobId: String(job.id),
      },
      data: {
        status: "ACTIVE",
      },
    });

    for (let progress = 0; progress <= 100; progress += 10) {
      job.progress(progress);

      await prisma.job.update({
        where: {
          jobId: String(job.id),
        },
        data: {
          progress,
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    await processImage(job.data);

    await prisma.job.update({
      where: {
        jobId: String(job.id),
      },
      data: {
        status: "COMPLETED",
        progress: 100,
      },
    });

    logger.success(`Image Job ${job.id} Completed`);
  } catch (error) {
    await prisma.job.update({
      where: {
        jobId: String(job.id),
      },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown Error",
      },
    });

    logger.error(`Image Job ${job.id} Failed`);

    throw error;
  }
});