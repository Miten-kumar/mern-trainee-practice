import axiosInstance from "./axiosInstance";
import type {
  AccessibilityPreferences,
  ApiResponse,
} from "../types/accessibility.types";

export const getAccessibilityPreferences =
  async (): Promise<AccessibilityPreferences> => {
    const response =
      await axiosInstance.get<
        ApiResponse<AccessibilityPreferences>
      >("/accessibility/preferences");

    return response.data.data;
  };

export const updateAccessibilityPreferences =
  async (
    preferences: AccessibilityPreferences
  ): Promise<AccessibilityPreferences> => {
    const response =
      await axiosInstance.put<
        ApiResponse<AccessibilityPreferences>
      >(
        "/accessibility/preferences",
        preferences
      );

    return response.data.data;
  };