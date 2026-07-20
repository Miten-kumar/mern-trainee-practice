export interface LoginRequest {
  email: string;
  password: string;
}


export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}


export interface User {
  id: number;
  name: string;
  email: string;
}


export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}


export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;
}