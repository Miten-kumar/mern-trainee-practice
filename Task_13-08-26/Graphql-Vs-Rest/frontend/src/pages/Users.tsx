import { useCallback, useEffect,useState } from "react";

import { getUsers } from "../api/restApi";
import type { User } from "../types/user.types";

import UserList from "../components/UserList";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import "./pages.css";

const Users = () => {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchUsers = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUsers();

        setUsers(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch REST users"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <Loading message="Loading REST users..." />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchUsers}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="api-info-banner rest-banner">
        <div>
          <strong>
            REST API
          </strong>

          <span>
            GET /api/v1/users
          </span>
        </div>

        <span className="status-badge">
          Connected
        </span>
      </div>

      <UserList
        users={users}
        title="REST Users"
        apiType="REST"
      />
    </div>
  );
};

export default Users;