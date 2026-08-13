export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface GraphQLError {
  message: string;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}