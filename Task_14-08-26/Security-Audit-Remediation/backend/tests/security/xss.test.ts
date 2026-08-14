import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app.js";

describe("XSS Protection", () => {
  it("should sanitize script tags from user input", async () => {
    const email =
      `xss-${Date.now()}@example.com`;

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name:
          '<script>alert("XSS")</script>John',
        email,
        password: "StrongPassword123!",
      });

    if (response.status === 201) {
      expect(
        response.body.data.name
      ).not.toContain("<script>");

      expect(
        response.body.data.name
      ).not.toContain("alert(");
    }
  });

  it("should handle HTML injection payload", async () => {
    const email =
      `html-${Date.now()}@example.com`;

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name:
          '<img src=x onerror=alert(1)>',
        email,
        password: "StrongPassword123!",
      });

    if (response.status === 201) {
      expect(
        response.body.data.name
      ).not.toContain("<img");
    }
  });
});