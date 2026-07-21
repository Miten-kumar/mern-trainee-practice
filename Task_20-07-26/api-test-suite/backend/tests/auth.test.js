const request = require("supertest");
const { createDb } = require("../src/db.js");
const createApp = require("../src/app.js");

describe("POST /api/auth/register", () => {
  let app, db;

  // fresh in-memory db before every single test, not just every file -
  // this is what keeps tests from affecting each other
  beforeEach(() => {
    db = createDb(":memory:");
    app = createApp(db);
  });

  test("happy path: registers a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body.id).toBeDefined();
  });

  test("actually stores the user in the database, not just returns a response", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    const row = db.prepare("SELECT * FROM users WHERE email = ?").get("test@example.com");
    expect(row).toBeDefined();
    expect(row.password_hash).not.toBe("password123"); // should be hashed, not plaintext
  });

  test("error case: missing email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ password: "password123" });

    expect(res.status).toBe(400);
  });

  test("error case: missing password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(400);
  });

  test("edge case: password under 8 characters is rejected", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "short" });

    expect(res.status).toBe(400);
  });

  test("error case: duplicate email is rejected", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "dup@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "dup@example.com", password: "password123" });

    expect(res.status).toBe(409);

    // check the db directly - make sure the duplicate attempt didn't
    // insert a second row before failing
    const count = db
      .prepare("SELECT COUNT(*) as count FROM users WHERE email = ?")
      .get("dup@example.com");
    expect(count.count).toBe(1);
  });
});

describe("POST /api/auth/login", () => {
  let app, db;

  beforeEach(async () => {
    db = createDb(":memory:");
    app = createApp(db);
    await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });
  });

  test("happy path: logs in with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("actually creates a session row in the database", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    const session = db.prepare("SELECT * FROM sessions WHERE token = ?").get(res.body.token);
    expect(session).toBeDefined();
  });

  test("error case: wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
  });

  test("error case: email that was never registered", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });

    expect(res.status).toBe(401);
  });

  test("edge case: same error message for wrong password vs unknown email", async () => {
    // this matters for security - the response shouldn't tell an
    // attacker whether the account exists or not
    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    const unknownEmail = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });

    expect(wrongPassword.body.error).toBe(unknownEmail.body.error);
  });
});
