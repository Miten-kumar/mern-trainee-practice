import { PrismaClient } from "@prisma/client";

const prisma =
new PrismaClient();

async function main(){
    // Remove old data

    await prisma.product.deleteMany();

    const products = [];

    const images = [

        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",

        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",

        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",

        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",

        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",

        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f"

    ];

    for(let i=1;i<=50;i++){
        products.push({
            name:
            `Product ${i}`,

            description:
            `This is product description for item ${i}`,

            price:
            Math.floor(
                Math.random()*1000
            ) + 100,

            image:
            `${images[i % images.length]}?auto=format&fit=crop&w=400&q=80`

        });
    }

    await prisma.product.createMany({

        data:products

    });

    console.log(
        " 50 Products Created Successfully"
    );


}

main()

.then(async()=>{
    await prisma.$disconnect();


})
.catch(async(error)=>{

    console.error(error);

    await prisma.$disconnect();

    process.exit(1);


});