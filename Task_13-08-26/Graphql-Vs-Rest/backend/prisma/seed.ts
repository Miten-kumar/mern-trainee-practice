import bcrypt from "bcryptjs";
import { prisma } from "../src/config/database.js";
import process from "process";

async function main() {
  const hashedPassword = await bcrypt.hash(
    "password123",
    10
  );

  const user = await prisma.user.upsert({
    where: {
      email: "bhoomi@example.com",
    },
    update: {
      password: hashedPassword,
    },
    create: {
      name: "Bhoomi Purohit",
      email: "bhoomi@example.com",
      password: hashedPassword,
    },
  });

  console.log("User created/updated:");
  console.log({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });