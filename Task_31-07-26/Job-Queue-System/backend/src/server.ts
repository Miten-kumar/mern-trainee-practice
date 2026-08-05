import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import prisma from "./config/prisma";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    console.log(" PostgreSQL Connected");

    app.listen(PORT, () => {
      console.log(` Server Running`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Failed");
    console.error(error);

    process.exit(1);
  }
}

startServer();