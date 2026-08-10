import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(" Starting database seed...");

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "Bhoomi",
        email: "bhoomi@example.com",
      },
      {
        name: "Rahul",
        email: "rahul@example.com",
      },
      {
        name: "Priya",
        email: "priya@example.com",
      },
    ],
  });

  // Create products
  const products = await prisma.product.createManyAndReturn({
    data: [
      {
        name: "Laptop",
        price: 50000,
        stock: 5,
        version: 0,
      },
      {
        name: "Keyboard",
        price: 2000,
        stock: 10,
        version: 0,
      },
      {
        name: "Mouse",
        price: 1000,
        stock: 20,
        version: 0,
      },
      {
        name: "Monitor",
        price: 15000,
        stock: 3,
        version: 0,
      },
      {
        name: "Headphones",
        price: 3000,
        stock: 8,
        version: 0,
      },
    ],
  });

  console.log("Users created:");
  console.log(users);

  console.log("Products created:");
  console.log(products);

  console.log(" Database seed completed!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });