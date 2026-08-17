import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("Application", () => {
  it("should return API information", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      success: true,
      message: "CI/CD Backend API",
    });
  });

  it("should return 404 for an unknown route", async () => {
    const response = await request(app)
      .get("/api/v1/unknown");

    expect(response.status).toBe(404);
  });
});