import apiClient from "../api/apiClient";

import {
  User,
} from "../types/user.types";


export const userService = {


  // Get All Users
  getUsers: async (): Promise<User[]> => {

    const response =
      await apiClient.get(
        "/users"
      );

    return response.data;

  },


  // Get Single User
  getUserById: async (
    id:number
  ): Promise<User> => {

    const response =
      await apiClient.get(
        `/users/${id}`
      );

    return response.data;

  },


  // Create User
  createUser: async (
    data: Omit<User,"id">
  ) => {

    const response =
      await apiClient.post(
        "/users",
        data
      );

    return response.data;

  },


  // Update User
  updateUser: async (
    id:number,
    data:Omit<User,"id">
  ) => {

    const response =
      await apiClient.put(
        `/users/${id}`,
        data
      );

    return response.data;

  },


  // Delete User
  deleteUser: async (
    id:number
  ) => {

    const response =
      await apiClient.delete(
        `/users/${id}`
      );

    return response.data;

  },


};