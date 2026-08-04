import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


async function main(){

    // Users Seed Data

    await prisma.user.createMany({

        data:[

            {
                name:"Bhoomi",
                email:"bhoomi@test.com"
            },

            {
                name:"Rahul",
                email:"rahul@test.com"
            },

            {
                name:"Amit",
                email:"amit@test.com"
            }

        ],

        skipDuplicates:true

    });


    // Products Seed Data

    await prisma.product.createMany({

        data:[

            {
                name:"iPhone 17",
                category:"electronics",
                price:999
            },

            {
                name:"MacBook Pro",
                category:"electronics",
                price:1999
            },

            {
                name:"Mechanical Keyboard",
                category:"accessories",
                price:120
            },

            {
                name:"Wireless Mouse",
                category:"accessories",
                price:50
            },

            {
                name:"Premium T-Shirt",
                category:"fashion",
                price:30
            }

        ],

        skipDuplicates:true

    });

    console.log(
        "Users and Products added successfully"
    );

}


main()

.catch((error)=>{

    console.error(error);

    process.exit(1);

})

.finally(async()=>{

    await prisma.$disconnect();

});