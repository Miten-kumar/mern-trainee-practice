import { beforeAll, afterAll } from "vitest";

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  process.env.JWT_SECRET =
    "test-jwt-secret-that-is-at-least-32-characters";

  process.env.COOKIE_SECRET =
    "test-cookie-secret-that-is-at-least-32-characters";

  process.env.FRONTEND_URL =
    "http://localhost:5173";

  process.env.PORT = "5000";
});

afterAll(async () => {
  // Close test resources here if required.
});