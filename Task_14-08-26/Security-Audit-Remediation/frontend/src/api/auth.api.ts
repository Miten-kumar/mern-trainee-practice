import {
  api,
  fetchCsrfToken,
  clearCsrfToken,
} from "./axios";

import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
} from "../types/auth.types";

/**
 * Register
 */
export const registerUser =
  async (
    data: RegisterInput
  ): Promise<AuthResponse> => {
    await fetchCsrfToken();

    const response = await api.post(
      "/auth/register",
      data
    );

    return response.data;
  };

/**
 * Login
 */
export const loginUser =
  async (
    data: LoginInput
  ): Promise<AuthResponse> => {
    await fetchCsrfToken();

    const response = await api.post(
      "/auth/login",
      data
    );

    return response.data;
  };

/**
 * Get currently authenticated user
 */
export const getCurrentUser =
  async (): Promise<AuthResponse> => {
    const response = await api.get(
      "/auth/me"
    );

    return response.data;
  };

/**
 * Logout
 */
export const logoutUser =
  async (): Promise<void> => {
    await api.post(
      "/auth/logout"
    );

    clearCsrfToken();
  };