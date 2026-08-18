import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app.js";

describe("SQL Injection Protection", () => {
  it("should reject SQL injection in email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "' OR '1'='1",
        password: "' OR '1'='1",
      });

    expect([400, 401, 403]).toContain(
      response.status
    );

    expect(response.body.success).toBe(false);
  });

  it("should not allow SQL injection through user ID", async () => {
    const response = await request(app)
      .get("/api/v1/users/1' OR '1'='1");

    expect([400, 401, 404]).toContain(
      response.status
    );
  });

  it("should reject SQL comment injection", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "admin@example.com' --",
        password: "anything",
      });

    expect([400, 401, 403]).toContain(
      response.status
    );

    expect(response.body.success).toBe(false);
  });
});