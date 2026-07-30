import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


async function main(){

    await prisma.user.createMany({

        data:[

            {
                name:"Bhoomi Purohit",
                email:"bhoomi@gmail.com"
            },


            {
                name:"Rahul Sharma",
                email:"rahul@gmail.com"
            },


            {
                name:"Amit Patel",
                email:"amit@gmail.com"
            }
        ],

        skipDuplicates:true

    });

    console.log(
        "Users seeded successfully"
    );
}

main()
.then(()=>{

    console.log("Seed completed");

})
.catch((error)=>{

    console.error(error);

    process.exit(1);

})
.finally(async()=>{

    await prisma.$disconnect();

});