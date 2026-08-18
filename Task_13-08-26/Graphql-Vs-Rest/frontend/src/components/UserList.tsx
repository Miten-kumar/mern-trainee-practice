import type { User } from "../types/user.types";

import UserCard from "./UserCard";

import "./components.css";

interface UserListProps {
  users: User[];
  title: string;
  apiType: "REST" | "GraphQL";
}

const UserList = ({
  users,
  title,
  apiType,
}: UserListProps) => {
  return (
    <section className="user-list">
      <div className="user-list-header">
        <div>
          <h1>{title}</h1>

          <p>
            Data fetched using{" "}
            <strong>{apiType}</strong>
          </p>
        </div>

        <span
          className={`api-badge ${apiType.toLowerCase()}`}
        >
          {apiType}
        </span>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          No users found.
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default UserList;