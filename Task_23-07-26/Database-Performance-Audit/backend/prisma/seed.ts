import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main(){


await prisma.user.deleteMany();


const user1 =
await prisma.user.create({

data:{

name:"John Doe",

email:"john@test.com",

orders:{


create:[

{
amount:500,
status:"COMPLETED"
},

{
amount:1000,
status:"PENDING"
}

]


}


}

});



const user2 =
await prisma.user.create({

data:{

name:"David Smith",

email:"david@test.com",

orders:{


create:[

{
amount:700,
status:"COMPLETED"
}

]


}


}

});



console.log(
"Seed Data Created"
);


}


main()

.finally(async()=>{

await prisma.$disconnect();

});