import request from "supertest";
import app from "../../app";


describe(
  "SQL Injection Protection",
  () => {


    test(
      "blocks SQL injection",
      async()=>{

        const response =
          await request(app)
          .post("/api/users")
          .send({
            email:"' OR 1=1 --",
            password:"12345678"
          });


        expect(response.status)
          .toBe(400);

      }
    );


  }
);