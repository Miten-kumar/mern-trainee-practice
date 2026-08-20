import { useEffect, useState } from "react";

import { getUsers } from "./api/userApi";

import { UserForm } from "./components/UserForm";
import { UserList } from "./components/userList";

import type { User } from "./types/user";

import "./index.css";

function App() {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /**
   * Load users from backend
   */
  const loadUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);

      setError(
        "Unable to load users. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load users when component mounts
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUsers();
  }, []);

  /**
   * Add newly created user to UI
   */
  const handleUserCreated = (user: User): void => {
    setUsers((previousUsers) => [
      ...previousUsers,
      user,
    ]);
  };

  return (
    <main className="container">
      <header className="page-header">
        <h1>Decorator Validation System</h1>

        <p>
          React + TypeScript + Express + Decorators
        </p>
      </header>

      <section aria-labelledby="create-user-heading">
        <UserForm
          onUserCreated={handleUserCreated}
        />
      </section>

      <UserList
        users={users}
        loading={loading}
        error={error}
      />
    </main>
  );
}

export default App;