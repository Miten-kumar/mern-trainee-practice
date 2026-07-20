import apiClient from "../api/apiClient";

interface LoginData {
  email: string;
  password: string;
}


interface RegisterData {
  name: string;
  email: string;
  password: string;
}


export const authService = {

  // Register API
  register: async (
    data: RegisterData
  ) => {

    const response =
      await apiClient.post(
        "/auth/register",
        data
      );

    return response.data;
  },


  // Login API
  login: async (
    data: LoginData
  ) => {

    const response =
      await apiClient.post(
        "/auth/login",
        data
      );

    return response.data;
  },


  // Logout
  logout: () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

  },


};