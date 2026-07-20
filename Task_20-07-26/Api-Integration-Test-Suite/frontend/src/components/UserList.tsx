import { User } from "../types/user.types";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserList = ({
  users,
  onEdit,
  onDelete,
}: UserListProps) => {
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <table border={1} cellPadding={10}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>

            <td>{user.name}</td>

            <td>{user.email}</td>

            <td>
              <button onClick={() => onEdit(user)}>
                Edit
              </button>

              <button
                onClick={() => onDelete(user.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;