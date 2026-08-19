import { useState } from 'react';
import { api } from '../services/api';

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { user } = await api.login(form);
      onSuccess(user);
    } catch (err) {
      // Generic message only — matches the backend's generic error so the
      // UI never contradicts the server and leaks which field was wrong.
      setError('Invalid username or password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <label htmlFor="username">Username</label>
      <input
        id="username"
        autoComplete="username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      {error && <p role="alert" className="form-error">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
