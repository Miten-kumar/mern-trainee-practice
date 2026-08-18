import { api } from "./axios";

import type {
  User,
} from "../types/user.types";

/**
 * Get all users
 */
export const getUsers =
  async (): Promise<User[]> => {
    const response = await api.get(
      "/users"
    );

    return response.data.data;
  };

/**
 * Get user by ID
 */
export const getUserById =
  async (
    id: string
  ): Promise<User> => {
    const response = await api.get(
      `/users/${encodeURIComponent(id)}`
    );

    return response.data.data;
  };

/**
 * Update user
 */
export const updateUser =
  async (
    id: string,
    data: Partial<User>
  ): Promise<User> => {
    const response = await api.patch(
      `/users/${encodeURIComponent(id)}`,
      data
    );

    return response.data.data;
  };

/**
 * Delete user
 */
export const deleteUser =
  async (
    id: string
  ): Promise<void> => {
    await api.delete(
      `/users/${encodeURIComponent(id)}`
    );
  };