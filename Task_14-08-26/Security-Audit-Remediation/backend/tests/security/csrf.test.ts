import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app.js";

describe("CSRF Protection", () => {
  it("should generate a CSRF token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/csrf-token");

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.csrfToken).toBeDefined();

    expect(
      typeof response.body.csrfToken
    ).toBe("string");
  });

  it("should reject state-changing request without CSRF token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@example.com",
        password: "WrongPassword123!",
      });

    expect(response.status).toBe(403);
  });
});