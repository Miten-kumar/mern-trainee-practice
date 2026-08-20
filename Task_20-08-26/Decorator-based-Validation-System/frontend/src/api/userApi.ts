import apiClient from "./client";

import type {
  User,
  CreateUserInput,
  UpdateUserInput,
} from "../types/user";

import type {
  ApiSuccess,
} from "../types/api";

/**
 * Create user
 */
export const createUser = async (
  data: CreateUserInput
): Promise<User> => {
  const response =
    await apiClient.post<ApiSuccess<User>>(
      "/users",
      data
    );

  return response.data.data;
};

/**
 * Get all users
 */
export const getUsers = async (): Promise<User[]> => {
  const response =
    await apiClient.get<ApiSuccess<User[]>>(
      "/users"
    );

  return response.data.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (
  id: string
): Promise<User> => {
  const response =
    await apiClient.get<ApiSuccess<User>>(
      `/users/${id}`
    );

  return response.data.data;
};

/**
 * Update user
 */
export const updateUser = async (
  id: string,
  data: UpdateUserInput
): Promise<User> => {
  const response =
    await apiClient.put<ApiSuccess<User>>(
      `/users/${id}`,
      data
    );

  return response.data.data;
};

/**
 * Delete user
 */
export const deleteUser = async (
  id: string
): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};