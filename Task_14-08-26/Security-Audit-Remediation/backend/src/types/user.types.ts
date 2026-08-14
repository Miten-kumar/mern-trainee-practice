export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}