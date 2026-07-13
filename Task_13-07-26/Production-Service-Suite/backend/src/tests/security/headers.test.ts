import request from "supertest";
import app from "../../app";


describe(
"Security Headers",
()=>{


test(
"should contain helmet headers",
async()=>{


const response =
await request(app)
.get("/");


expect(
response.headers
)
.toHaveProperty(
"x-content-type-options"
);


expect(
response.headers
)
.toHaveProperty(
"x-frame-options"
);


expect(
response.headers
)
.toHaveProperty(
"strict-transport-security"
);


});

});