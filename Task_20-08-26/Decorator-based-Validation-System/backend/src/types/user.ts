export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  age: number;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  age?: number;
  password?: string;
}