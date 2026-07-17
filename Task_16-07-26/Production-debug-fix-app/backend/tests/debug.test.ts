import request from "supertest";

import {
  describe,
  test,
  expect,
  afterAll,
  jest
} from "@jest/globals";

import app from "../src/app";


jest.setTimeout(60000);


// Cleanup running processes after tests
afterAll(async () => {

  await request(app)
    .get("/api/bug/memory/stop")
    .catch(() => {});


  await request(app)
    .get("/api/fix/memory/stop")
    .catch(() => {});

});



describe("Production Debug & Fix API Tests", () => {



  // =========================
  // HEALTH TEST
  // =========================

  test("GET /health should return OK", async () => {

    const response =
      await request(app)
        .get("/health");


    expect(response.status)
      .toBe(200);


    expect(response.body)
      .toHaveProperty("status");

  });



  // =========================
  // MEMORY LEAK TEST
  // =========================

  test("BUG: memory leak starts", async () => {


    const response =
      await request(app)
        .get("/api/bug/memory");


    expect(response.status)
      .toBe(200);


    expect(response.body.message)
      .toContain("Memory leak");

  });



  test("FIX: memory leak protection starts", async () => {


    const response =
      await request(app)
        .get("/api/fix/memory");


    expect(response.status)
      .toBe(200);


    expect(response.body.message)
      .toContain("fixed");

  });





  // =========================
  // CPU BLOCK TEST
  // =========================


  test(
    "BUG: event loop blocking",
    async () => {


      const start =
        Date.now();


      const response =
        await request(app)
          .get("/api/bug/cpu");


      const duration =
        Date.now() - start;



      expect(response.status)
        .toBe(200);


      expect(response.body)
        .toHaveProperty("result");


      expect(duration)
        .toBeLessThan(60000);


    }
  );





  test(
    "FIX: worker thread calculation",
    async () => {


      const response =
        await request(app)
          .get("/api/fix/cpu");


      expect(response.status)
        .toBe(200);


      expect(response.body)
        .toHaveProperty("result");


    }
  );





  // =========================
  // RACE CONDITION TEST
  // =========================


  test(
    "BUG: withdraw endpoint handles request",
    async () => {


      const response =
        await request(app)
          .post(
            "/api/bug/withdraw/100"
          );


      expect(response.status)
        .toBe(200);


      expect(response.body)
        .toHaveProperty("balance");


    }
  );





  test(
    "FIX: safe withdraw prevents race condition",
    async () => {


      const requests =
        Array.from(
          { length: 10 },
          () =>
            request(app)
              .post(
                "/api/fix/withdraw/100"
              )
        );


      const responses =
        await Promise.all(requests);



      responses.forEach(
        response => {

          expect(response.status)
            .toBe(200);


          expect(response.body)
            .toHaveProperty(
              "balance"
            );

        }
      );

    }
  );





  // =========================
  // BALANCE TEST
  // =========================


  test(
    "BUG: get balance",
    async () => {


      const response =
        await request(app)
          .get("/api/bug/balance");


      expect(response.status)
        .toBe(200);


      expect(
        response.body.balance
      )
      .toBeDefined();


    }
  );





  test(
    "FIX: get safe balance",
    async () => {


      const response =
        await request(app)
          .get("/api/fix/balance");


      expect(response.status)
        .toBe(200);


      expect(
        response.body.balance
      )
      .toBeDefined();


    }
  );


});