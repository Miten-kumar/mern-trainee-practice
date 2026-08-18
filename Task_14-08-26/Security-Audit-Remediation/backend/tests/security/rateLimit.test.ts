import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app.js";

describe("Rate Limiting", () => {
  it("should rate limit excessive login attempts", async () => {
    const csrfResponse = await request(app)
      .get("/api/v1/auth/csrf-token");

    expect(csrfResponse.status).toBe(200);

    const csrfToken =
      csrfResponse.body.csrfToken;

    expect(csrfToken).toBeDefined();

    const cookies =
      csrfResponse.headers["set-cookie"];

    if (!cookies) {
      throw new Error(
        "CSRF cookie was not set"
      );
    }

    const responses = [];

    for (let i = 0; i < 11; i++) {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          email: "attacker@example.com",
          password: "WrongPassword123!",
        });

      responses.push(response);
    }

    const rateLimited =
      responses.some(
        (response) =>
          response.status === 429
      );

    expect(rateLimited).toBe(true);
  });
});