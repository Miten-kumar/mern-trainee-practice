import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {

  console.log("Starting database seeding...");


  await prisma.product.deleteMany();


  await prisma.product.createMany({

    data: [

      {
        name: "Apple MacBook Pro",
        category: "Laptop",
        description: "Powerful laptop with M-series processor"
      },

      {
        name: "Dell Inspiron Laptop",
        category: "Laptop",
        description: "Affordable performance laptop for daily use"
      },

      {
        name: "HP Pavilion Laptop",
        category: "Laptop",
        description: "Laptop with Intel processor and high performance"
      },

      {
        name: "Lenovo ThinkPad Laptop",
        category: "Laptop",
        description: "Business laptop with excellent keyboard"
      },

      {
        name: "Asus Gaming Laptop",
        category: "Laptop",
        description: "High performance gaming laptop"
      },


      {
        name: "Samsung Galaxy S25",
        category: "Mobile",
        description: "Latest Samsung flagship smartphone"
      },

      {
        name: "iPhone 16 Pro",
        category: "Mobile",
        description: "Premium Apple smartphone"
      },

      {
        name: "OnePlus 13",
        category: "Mobile",
        description: "Fast Android smartphone"
      },


      {
        name: "Logitech Wireless Keyboard",
        category: "Accessories",
        description: "Wireless keyboard for office work"
      },

      {
        name: "Mechanical Gaming Keyboard",
        category: "Accessories",
        description: "RGB mechanical keyboard for gamers"
      },


      {
        name: "Logitech Wireless Mouse",
        category: "Accessories",
        description: "Ergonomic wireless mouse"
      },


      {
        name: "Sony Wireless Headphones",
        category: "Audio",
        description: "Noise cancelling headphones"
      },


      {
        name: "Boat Bluetooth Earbuds",
        category: "Audio",
        description: "Affordable wireless earbuds"
      },


      {
        name: "Apple AirPods Pro",
        category: "Audio",
        description: "Premium wireless earbuds"
      },


      {
        name: "Samsung Smart Watch",
        category: "Wearables",
        description: "Smart watch with fitness tracking"
      },


      {
        name: "Fitness Smart Band",
        category: "Wearables",
        description: "Track health and activity"
      },


      {
        name: "HP Wireless Printer",
        category: "Printer",
        description: "Compact wireless printer"
      },


      {
        name: "Canon Inkjet Printer",
        category: "Printer",
        description: "Color printing solution"
      },


      {
        name: "External SSD 1TB",
        category: "Storage",
        description: "Fast portable storage device"
      },


      {
        name: "Samsung External Hard Drive",
        category: "Storage",
        description: "Reliable external storage"
      }

    ]

  });


  console.log("Database seeded successfully!");

}



main()
  .catch((error) => {

    console.error(error);

    process.exit(1);

  })
  .finally(async () => {

    await prisma.$disconnect();

  });