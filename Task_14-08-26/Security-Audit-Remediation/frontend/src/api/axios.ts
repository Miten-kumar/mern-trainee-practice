import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let csrfToken: string | null = null;

export const fetchCsrfToken =
  async (): Promise<string> => {
    const response = await api.get(
      "/auth/csrf-token"
    );

    const token =
      response.data?.csrfToken;

    if (
      typeof token !== "string" ||
      token.length === 0
    ) {
      throw new Error(
        "CSRF token was not returned by server"
      );
    }

    csrfToken = token;

    return token;
  };

api.interceptors.request.use(
  async (config) => {
    const method =
      config.method?.toUpperCase();

    const isStateChanging =
      method === "POST" ||
      method === "PUT" ||
      method === "PATCH" ||
      method === "DELETE";

    const isCsrfRequest =
      config.url === "/auth/csrf-token";

    if (
      isStateChanging &&
      !isCsrfRequest
    ) {
      const token =
        csrfToken ??
        (await fetchCsrfToken());

      config.headers["X-CSRF-Token"] =
        token;
    }

    return config;
  }
);

export const clearCsrfToken =
  (): void => {
    csrfToken = null;
  };