import request from "supertest";

import app from "../src/app.js";

import {
 prisma,
 cleanDatabase
} from "./setup/testDb.js";



let token:string;



beforeEach(async()=>{


await cleanDatabase();



await request(app)
.post("/api/auth/register")
.send({

name:"Admin",

email:"admin@test.com",

password:"123456"

});



const login =
await request(app)
.post("/api/auth/login")
.send({

email:"admin@test.com",

password:"123456"

});


token =
login.body.token;


});





describe(
"User CRUD Integration",
()=>{



test(
"Create user",
async()=>{


const response =
await request(app)

.post("/api/users")

.set(
"Authorization",
`Bearer ${token}`
)

.send({

name:"New User",

email:"new@test.com",

password:"123456"

});



expect(response.status)
.toBe(201);



const user =
await prisma.user.findUnique({

where:{
email:"new@test.com"
}

});


expect(user)
.not.toBeNull();


});





test(
"Get users",
async()=>{


const response =
await request(app)

.get("/api/users")

.set(
"Authorization",
`Bearer ${token}`
);



expect(response.status)
.toBe(200);



});





test(
"Update user",
async()=>{


const user =
await prisma.user.create({

data:{

name:"Old",

email:"old@test.com",

password:"123"

}

});



const response =
await request(app)

.put(`/api/users/${user.id}`)

.set(
"Authorization",
`Bearer ${token}`
)

.send({

name:"Updated"

});



expect(response.status)
.toBe(200);



});






test(
"Delete user",
async()=>{


const user =
await prisma.user.create({

data:{

name:"Delete",

email:"delete@test.com",

password:"123"

}

});



const response =
await request(app)

.delete(`/api/users/${user.id}`)

.set(
"Authorization",
`Bearer ${token}`
);



expect(response.status)
.toBe(200);



const deleted =
await prisma.user.findUnique({

where:{
id:user.id
}

});


expect(deleted)
.toBeNull();



});



});