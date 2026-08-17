import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("Health API", () => {
  it("should return API status", async () => {
    const response = await request(app)
      .get("/api/v1/health");

    expect([200, 503]).toContain(response.status);

    expect(response.body).toHaveProperty("status");
  });
});