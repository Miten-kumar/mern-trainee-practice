import { useEffect, useState } from "react";
import { getUsers } from "../api/users.api";
import type { User } from "../types/user.types";
import { getErrorMessage } from "../utils/error";

const Users = () => {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadUsers =
      async (): Promise<void> => {
        try {
          setLoading(true);

          const data =
            await getUsers();

          setUsers(data);
        } catch (error) {
          setError(
            getErrorMessage(error)
          );
        } finally {
          setLoading(false);
        }
      };

    void loadUsers();
  }, []);

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading users...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          Users
        </h1>

        <p className="dashboard-description">
          Manage application users and
          their account information.
        </p>
      </header>

      {error && (
        <p
          className="error-message"
          role="alert"
        >
          {error}
        </p>
      )}

      {!error &&
        users.length === 0 && (
          <p>No users found.</p>
        )}

      {!error && users.length > 0 && (
        <section className="security-grid">
          {users.map((user) => (
            <article
              className="security-card"
              key={user.id}
            >
              <h3>
                {user.name}
              </h3>

              <p
                style={{
                  color: "#6b7280",
                  fontWeight: 400,
                }}
              >
                {user.email}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default Users;