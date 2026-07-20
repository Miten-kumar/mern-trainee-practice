import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main(){

  await prisma.user.upsert({

    where:{
      email:"john@test.com"
    },

    update:{},

    create:{
      name:"John",
      email:"john@test.com",
      password:"123456"
    }

  });


}


main()
.then(async()=>{
    await prisma.$disconnect();
})
.catch(async(e)=>{
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
});