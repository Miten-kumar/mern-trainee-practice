import bcrypt from "bcrypt";

import { prisma } from "./testDb.js";


export async function seedDatabase(){


 const password =
 await bcrypt.hash(
   "password123",
   10
 );


 await prisma.user.create({

  data:{

    name:"Test User",

    email:"test@example.com",

    password

  }

 });


}