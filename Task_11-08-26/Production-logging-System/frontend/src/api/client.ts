import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const correlationId = crypto.randomUUID();

  config.headers.set(
    "X-Correlation-ID",
    correlationId
  );

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API request failed:",
      error
    );

    return Promise.reject(error);
  }
);