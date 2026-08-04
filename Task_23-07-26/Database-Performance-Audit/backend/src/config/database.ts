import { PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient({
  log: [
    "query",
    "error",
    "warn"
  ],
});


export async function connectDatabase() {
  try {

    await prisma.$connect();

    console.log(
      "PostgreSQL Database Connected Successfully"
    );

  } catch (error) {

    console.error(
      "Database Connection Failed:",
      error
    );

    process.exit(1);

  }
}