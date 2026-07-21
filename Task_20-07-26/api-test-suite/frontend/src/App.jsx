import { useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:5000/api";

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");

    // try to register first - fine if it fails because the account
    // already exists, this just makes the demo easier to click through
    await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setAuthError(data.error);
      return;
    }

    setToken(data.token);
    loadTodos(data.token);
  }

  async function loadTodos(authToken) {
    const res = await fetch(`${API_BASE}/todos`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await res.json();
    setTodos(data.todos);
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: newTitle }),
    });

    setNewTitle("");
    loadTodos(token);
  }

  async function handleToggle(todo) {
    await fetch(`${API_BASE}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    loadTodos(token);
  }

  async function handleDelete(todo) {
    await fetch(`${API_BASE}/todos/${todo.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadTodos(token);
  }

  if (!token) {
    return (
      <div className="auth-screen">
        <form onSubmit={handleLogin}>
          <h1>Todo App</h1>
          <p className="hint">any email/password works, registers automatically if new</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
          />
          <button type="submit">Log in</button>
          {authError && <p className="error">{authError}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Todos</h1>
      <form onSubmit={handleAddTodo}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="new todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "done" : ""}>
            <span onClick={() => handleToggle(todo)}>{todo.title}</span>
            <button onClick={() => handleDelete(todo)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
