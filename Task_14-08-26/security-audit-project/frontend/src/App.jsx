import { useEffect, useState } from 'react';
import Feed from './pages/Feed';
import LoginForm from './components/LoginForm';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    api.me().then((d) => setUser(d.user)).catch(() => {}).finally(() => setChecked(true));
  }, []);

  async function handleLogout() {
    await api.logout();
    setUser(null);
  }

  if (!checked) return null;

  return (
    <main className="app-shell">
      <header>
        <h1>SecureBlog</h1>
        {user ? (
          <div>
            <span>Hi, {user.username}</span>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <span>Not signed in</span>
        )}
      </header>

      {!user && <LoginForm onSuccess={setUser} />}
      <Feed />
    </main>
  );
}
