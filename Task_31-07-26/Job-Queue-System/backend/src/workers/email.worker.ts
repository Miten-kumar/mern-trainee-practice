import { Job } from "bull";

import { emailQueue } from "../queues/email.queue";
import prisma from "../config/prisma";
import { sendEmail } from "../services/email.service";
import { EmailJobData } from "../types/job.types";
import { logger } from "../utils/logger";

logger.info("Email Worker Started");

emailQueue.process(5, async (job: Job<EmailJobData>) => {
  try {
    await prisma.job.update({
      where: {
        jobId: String(job.id),
      },
      data: {
        status: "ACTIVE",
      },
    });

    for (let progress = 0; progress <= 100; progress += 20) {
      job.progress(progress);

      await prisma.job.update({
        where: {
          jobId: String(job.id),
        },
        data: {
          progress,
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await sendEmail(job.data);

    await prisma.job.update({
      where: {
        jobId: String(job.id),
      },
      data: {
        status: "COMPLETED",
        progress: 100,
      },
    });

    logger.success(`Email Job ${job.id} Completed`);
  } catch (error) {

    console.error("FULL ERROR:", error);

    await prisma.job.update({
        where:{
            jobId:String(job.id)
        },
        data:{
            status:"FAILED",
            error:
            error instanceof Error
            ? error.message
            : "Unknown error"
        }
    });

    logger.error(
        `Email Job ${job.id} Failed`
    );

    throw error;
  }
});