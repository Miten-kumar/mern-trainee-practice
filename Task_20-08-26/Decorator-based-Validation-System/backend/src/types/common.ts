export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    property: string;
    message: string;
  }>;
}

export type ApiResponse<T> =
  | ApiSuccess<T>
  | ApiError;