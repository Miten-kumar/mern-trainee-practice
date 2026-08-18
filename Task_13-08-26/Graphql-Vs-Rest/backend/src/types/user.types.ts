export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UserWithoutPassword {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}