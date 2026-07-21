const request = require("supertest");
const { createDb } = require("../src/db.js");
const createApp = require("../src/app.js");

async function registerAndLogin(app, email = "test@example.com") {
  await request(app).post("/api/auth/register").send({ email, password: "password123" });
  const res = await request(app).post("/api/auth/login").send({ email, password: "password123" });
  return res.body.token;
}

describe("todos API", () => {
  let app, db, token;

  beforeEach(async () => {
    db = createDb(":memory:");
    app = createApp(db);
    token = await registerAndLogin(app);
  });

  test("error case: no token provided", async () => {
    const res = await request(app).get("/api/todos");
    expect(res.status).toBe(401);
  });

  test("error case: invalid token", async () => {
    const res = await request(app)
      .get("/api/todos")
      .set("Authorization", "Bearer not-a-real-token");

    expect(res.status).toBe(401);
  });

  test("happy path: starts with an empty list", async () => {
    const res = await request(app).get("/api/todos").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.todos).toEqual([]);
  });

  test("happy path: create a todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "write tests" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("write tests");
    expect(res.body.completed).toBe(0);
  });

  test("error case: creating a todo with no title", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  test("edge case: title that's only whitespace is rejected", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "   " });

    expect(res.status).toBe(400);
  });

  test("happy path: update a todo", async () => {
    const created = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "old title" });

    const res = await request(app)
      .put(`/api/todos/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "new title", completed: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("new title");
    expect(res.body.completed).toBe(1);
  });

  test("error case: updating a todo that doesn't exist", async () => {
    const res = await request(app)
      .put("/api/todos/999999")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "x" });

    expect(res.status).toBe(404);
  });

  test("edge case: can't see or edit another user's todo", async () => {
    const created = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "user A todo" });

    const otherToken = await registerAndLogin(app, "other@example.com");

    const listRes = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${otherToken}`);
    expect(listRes.body.todos).toHaveLength(0); // user B sees nothing

    const editRes = await request(app)
      .put(`/api/todos/${created.body.id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ title: "hijacked" });
    expect(editRes.status).toBe(404); // user B can't touch user A's todo
  });

  test("happy path: delete a todo", async () => {
    const created = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "delete me" });

    const res = await request(app)
      .delete(`/api/todos/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);

    const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(created.body.id);
    expect(row).toBeUndefined();
  });

  describe("bulk-complete (tests the transaction)", () => {
    test("happy path: marks multiple todos completed in one request", async () => {
      const t1 = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "one" });
      const t2 = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "two" });

      const res = await request(app)
        .post("/api/todos/bulk-complete")
        .set("Authorization", `Bearer ${token}`)
        .send({ ids: [t1.body.id, t2.body.id] });

      expect(res.status).toBe(200);
      expect(res.body.todos.every((t) => t.completed === 1)).toBe(true);
    });

    test("edge case: empty ids array is rejected", async () => {
      const res = await request(app)
        .post("/api/todos/bulk-complete")
        .set("Authorization", `Bearer ${token}`)
        .send({ ids: [] });

      expect(res.status).toBe(400);
    });

    test("transaction rollback: one invalid id means NONE of them get marked complete", async () => {
      const t1 = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "one" });
      const t2 = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "two" });

      const res = await request(app)
        .post("/api/todos/bulk-complete")
        .set("Authorization", `Bearer ${token}`)
        .send({ ids: [t1.body.id, t2.body.id, 999999] }); // last id doesn't exist

      expect(res.status).toBe(400);

      // this is the actual proof the transaction rolled back correctly -
      // check the database directly instead of trusting the response.
      // if the fix wasn't transactional, t1 could be completed=1 here
      // even though the request failed overall
      const row1 = db.prepare("SELECT completed FROM todos WHERE id = ?").get(t1.body.id);
      const row2 = db.prepare("SELECT completed FROM todos WHERE id = ?").get(t2.body.id);
      expect(row1.completed).toBe(0);
      expect(row2.completed).toBe(0);
    });
  });
});
