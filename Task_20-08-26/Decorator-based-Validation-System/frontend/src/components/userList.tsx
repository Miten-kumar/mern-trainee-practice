import type {
  User,
} from "../types/user";

interface UserListProps {
  users: User[];
  loading: boolean;
  error: string;
}

export function UserList({
  users,
  loading,
  error,
}: UserListProps) {
  return (
    <section
      className="users"
      aria-labelledby="users-heading"
    >
      <h2 id="users-heading">
        Users
      </h2>

      {loading && (
        <p role="status">
          Loading users...
        </p>
      )}

      {error && (
        <p
          className="error"
          role="alert"
        >
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        users.length === 0 && (
          <p>
            No users found.
          </p>
        )}

      <div className="user-list">
        {users.map((user) => (
          <article
            className="user-card"
            key={user.id}
          >
            <h3>{user.name}</h3>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {user.email}
            </p>

            <p>
              <strong>
                Age:
              </strong>{" "}
              {user.age}
            </p>

            <small>
              ID: {user.id}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}