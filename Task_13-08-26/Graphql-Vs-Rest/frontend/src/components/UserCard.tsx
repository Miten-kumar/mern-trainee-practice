import type { User } from "../types/user.types";
import "./components.css";

interface UserCardProps {
  user: User;
}

const UserCard = ({
  user,
}: UserCardProps) => {
  return (
    <article className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          {user.name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <h3>{user.name}</h3>

          <span className="user-id">
            ID: {user.id}
          </span>
        </div>
      </div>

      <div className="user-card-body">
        <span className="user-label">
          Email
        </span>

        <p className="user-email">
          {user.email}
        </p>
      </div>
    </article>
  );
};

export default UserCard;