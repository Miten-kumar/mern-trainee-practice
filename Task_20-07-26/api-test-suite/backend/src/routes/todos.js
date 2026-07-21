const express = require("express");

function todosRoutes(db) {
  const router = express.Router();

  router.get("/", (req, res) => {
    const todos = db
      .prepare("SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC")
      .all(req.userId);
    res.json({ todos });
  });

  router.post("/", (req, res) => {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }

    const result = db
      .prepare("INSERT INTO todos (user_id, title) VALUES (?, ?)")
      .run(req.userId, title.trim());

    const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(todo);
  });

  router.put("/:id", (req, res) => {
    const { title, completed } = req.body;
    const todo = db
      .prepare("SELECT * FROM todos WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.userId);

    // scoped to user_id too, not just id - so one user can't edit
    // another user's todo just by guessing an id
    if (!todo) {
      return res.status(404).json({ error: "todo not found" });
    }

    db.prepare("UPDATE todos SET title = ?, completed = ? WHERE id = ?").run(
      title ?? todo.title,
      completed === undefined ? todo.completed : completed ? 1 : 0,
      todo.id
    );

    const updated = db.prepare("SELECT * FROM todos WHERE id = ?").get(todo.id);
    res.json(updated);
  });

  router.delete("/:id", (req, res) => {
    const todo = db
      .prepare("SELECT * FROM todos WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.userId);

    if (!todo) {
      return res.status(404).json({ error: "todo not found" });
    }

    db.prepare("DELETE FROM todos WHERE id = ?").run(todo.id);
    res.json({ deleted: true });
  });

  // marks several todos completed in one go - all or nothing. if any
  // id in the list is invalid, none of them should end up changed
  router.post("/bulk-complete", (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "ids must be a non-empty array" });
    }

    try {
      bulkComplete(db, req.userId, ids);
      const todos = db
        .prepare("SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC")
        .all(req.userId);
      res.json({ todos });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}

function bulkComplete(db, userId, ids) {
  db.exec("BEGIN");
  try {
    const stmt = db.prepare("UPDATE todos SET completed = 1 WHERE id = ? AND user_id = ?");
    for (const id of ids) {
      const result = stmt.run(id, userId);
      if (result.changes === 0) {
        // stop and roll back the second one of these ids doesn't check out -
        // don't want some todos marked complete and others not
        throw new Error(`todo ${id} not found or does not belong to you`);
      }
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

module.exports = todosRoutes;
