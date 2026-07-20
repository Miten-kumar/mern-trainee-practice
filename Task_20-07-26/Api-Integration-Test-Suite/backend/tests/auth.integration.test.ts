import request from "supertest";

import app from "../src/app.js";

import {
 prisma,
 cleanDatabase
} from "./setup/testDb.js";


beforeEach(async()=>{

 await cleanDatabase();

});



describe(
"Auth Integration Tests",
()=>{


test(
"Register new user",
async()=>{


const response =
await request(app)
.post("/api/auth/register")
.send({

name:"John",

email:"john@test.com",

password:"123456"

});



expect(response.status)
.toBe(201);



const user =
await prisma.user.findUnique({

where:{
 email:"john@test.com"
}

});


expect(user)
.not.toBeNull();



});





test(
"Duplicate email should fail",
async()=>{


await prisma.user.create({

data:{

name:"User",

email:"test@test.com",

password:"123456"

}

});



const response =
await request(app)
.post("/api/auth/register")
.send({

name:"Another",

email:"test@test.com",

password:"123456"

});



expect(response.status)
.toBe(409);



});






test(
"Login successful",
async()=>{


await request(app)
.post("/api/auth/register")
.send({

name:"Login User",

email:"login@test.com",

password:"123456"

});



const response =
await request(app)
.post("/api/auth/login")
.send({

email:"login@test.com",

password:"123456"

});



expect(response.status)
.toBe(200);


expect(response.body.token)
.toBeDefined();


});






test(
"Wrong password should fail",
async()=>{


await request(app)
.post("/api/auth/register")
.send({

name:"User",

email:"wrong@test.com",

password:"123456"

});



const response =
await request(app)
.post("/api/auth/login")
.send({

email:"wrong@test.com",

password:"wrong"

});



expect(response.status)
.toBe(401);



});


});