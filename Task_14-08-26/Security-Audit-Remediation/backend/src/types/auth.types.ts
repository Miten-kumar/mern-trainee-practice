export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface JwtPayload {
  sub: string;
  role: "USER" | "ADMIN";
}