import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor
 */
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error(
        "Network Error: Backend is unreachable"
      );
    } else {
      console.error(
        "Request Error:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;