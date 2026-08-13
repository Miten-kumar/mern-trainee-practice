import axios from "axios";

const GRAPHQL_API_URL =
  import.meta.env.VITE_GRAPHQL_URL;

const graphqlApi = axios.create({
  baseURL: GRAPHQL_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Get authentication token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * GraphQL request headers
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Login
 */
export const login = async (
  email: string,
  password: string
) => {
  const response = await graphqlApi.post("", {
    query: `
      mutation Login(
        $email: String!
        $password: String!
      ) {
        login(
          email: $email
          password: $password
        ) {
          token
          user {
            id
            name
            email
          }
        }
      }
    `,

    variables: {
      email,
      password,
    },
  });

  if (response.data.errors) {
    throw new Error(
      response.data.errors[0]?.message ||
        "Login failed"
    );
  }

  const authData =
    response.data.data.login;

  localStorage.setItem(
    "token",
    authData.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(authData.user)
  );

  return authData;
};

/**
 * Get GraphQL users
 */
export const getGraphQLUsers = async () => {
  const response = await graphqlApi.post(
    "",
    {
      query: `
        query {
          users {
            id
            name
            email
            createdAt
          }
        }
      `,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  if (response.data.errors) {
    throw new Error(
      response.data.errors[0]?.message ||
        "GraphQL request failed"
    );
  }

  return response.data.data.users;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default graphqlApi;