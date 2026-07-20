import { prisma } from "./setup/testDb.js";



describe(
"Database Transaction Tests",
()=>{


test(
"Transaction rollback should work",
async()=>{


try{


await prisma.$transaction(
async(tx)=>{


await tx.user.create({

data:{

name:"Transaction User",

email:"transaction@test.com",

password:"123"

}

});



throw new Error(
"Force rollback"
);


});


}
catch(error){


}



const user =
await prisma.user.findUnique({

where:{
email:"transaction@test.com"
}

});



expect(user)
.toBeNull();



});



});