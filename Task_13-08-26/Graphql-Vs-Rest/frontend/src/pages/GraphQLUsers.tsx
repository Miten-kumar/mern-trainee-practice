import { useCallback, useEffect, useState } from "react";
import { getGraphQLUsers } from "../api/graphqlApi";
import type { User } from "../types/user.types";

import UserList from "../components/UserList";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import "./pages.css";


const GraphQLUsers = () => {
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

        const data =
          await getGraphQLUsers();

        setUsers(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch GraphQL users"
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
      <Loading
        message="Loading GraphQL users..."
      />
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
      <div className="api-info-banner graphql-banner">
        <div>
          <strong>
            GraphQL API
          </strong>

          <span>
            POST /graphql
          </span>
        </div>

        <span className="status-badge">
          Connected
        </span>
      </div>

      <UserList
        users={users}
        title="GraphQL Users"
        apiType="GraphQL"
      />
    </div>
  );
};

export default GraphQLUsers;