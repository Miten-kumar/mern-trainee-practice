import { useState } from 'react';

// Bare-bones login so the demo can show authenticated mutations
// (createPost / createComment) from both the REST and GraphQL panels.
// Seeded users all use the password "password123".
export default function Login({ onLogin, currentUser }) {
  const [email, setEmail] = useState('aarav@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
      const { token, user } = await res.json();
      localStorage.setItem('token', token);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    onLogin(null);
  }

  if (currentUser) {
    return (
      <div className="login-box">
        Signed in as <strong>{currentUser.name}</strong>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }

  return (
    <form className="login-box" onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        type="password"
      />
      <button type="submit">Log in</button>
      {error && <span className="error">{error}</span>}
    </form>
  );
}
