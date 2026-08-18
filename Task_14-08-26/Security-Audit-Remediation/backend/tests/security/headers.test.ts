import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app.js";

describe("Security Headers", () => {
  it("should include security headers", async () => {
    const response = await request(app)
      .get("/health");

    expect(response.headers).toHaveProperty(
      "x-content-type-options"
    );

    expect(response.headers).toHaveProperty(
      "x-frame-options"
    );

    expect(response.headers).toHaveProperty(
      "content-security-policy"
    );
  });

  it("should disable X-Powered-By header", async () => {
    const response = await request(app)
      .get("/health");

    expect(
      response.headers["x-powered-by"]
    ).toBeUndefined();
  });
});