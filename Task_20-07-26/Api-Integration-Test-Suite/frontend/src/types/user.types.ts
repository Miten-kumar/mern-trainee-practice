export interface User {

  id: number;

  name: string;

  email: string;

  createdAt?: string;

  updatedAt?: string;

}


export interface CreateUserRequest {

  name: string;

  email: string;

}


export interface UpdateUserRequest {

  name?: string;

  email?: string;

}


export interface UserResponse {

  message: string;

  user: User;

}


export interface UsersResponse {

  users: User[];

}