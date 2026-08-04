import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({

  log:
    process.env.NODE_ENV === "development"
      ? [
          "query",
          "error",
          "warn"
        ]
      : [
          "error"
        ]

});

// Database Connection Test

export const connectDatabase = async () => {

  try {

    await prisma.$connect();

    console.log(
      " PostgreSQL Database Connected Successfully"
    );


  } catch (error) {


    console.error(
      " Database Connection Failed",
      error
    );

    process.exit(1);

  }

};

export default prisma;