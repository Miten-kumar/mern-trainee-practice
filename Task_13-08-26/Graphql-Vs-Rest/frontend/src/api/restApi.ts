import axios from "axios";
import type { User } from "../types/user.types";
import type { ApiResponse } from "../types/api.types";


const REST_API_URL =
  import.meta.env.VITE_REST_API_URL;

const restApi = axios.create({
  baseURL: REST_API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

/**
 * Get all users
 */
export const getUsers = async (): Promise<User[]> => {
  const response = await restApi.get<
    ApiResponse<User[]>
  >("/users");

  return response.data.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (
  id: number
): Promise<User> => {
  const response = await restApi.get<
    ApiResponse<User>
  >(`/users/${id}`);

  return response.data.data;
};

export default restApi;