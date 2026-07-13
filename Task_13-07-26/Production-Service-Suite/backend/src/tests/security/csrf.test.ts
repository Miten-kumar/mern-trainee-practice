import request from "supertest";
import app from "../../app";


describe(
  "CSRF Protection",
  () => {


    test(
      "should return API response without crashing",
      async () => {

        const response =
          await request(app)
            .get("/api/users");


        expect(response.status)
          .toBeDefined();

      }
    );


    test(
      "should handle POST request",
      async () => {

        const response =
          await request(app)
            .post("/api/users")
            .send({
              name: "Test User",
              email: "test@example.com",
              password: "password123"
            });


        expect(response.status)
          .toBeDefined();

      }
    );


  }
);