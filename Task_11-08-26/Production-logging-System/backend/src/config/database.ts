import { PrismaClient } from "@prisma/client";

import { logger } from "./logger.js";

export const prisma = new PrismaClient();

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();

    logger.info(
      "PostgreSQL connected successfully"
    );
  } catch (error) {
    logger.error(
      "PostgreSQL connection failed",
      {
        error,
      }
    );

    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();

  logger.info(
    "PostgreSQL disconnected successfully"
  );
}