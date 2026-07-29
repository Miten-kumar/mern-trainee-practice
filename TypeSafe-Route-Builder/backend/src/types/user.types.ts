export interface CreateUserRequest {

    name: string;

    email: string;

}

export interface UserResponse {

    id: number;

    name: string;

    email: string;

    createdAt: Date;

}

export interface ApiResponse<T> {

    success: boolean;

    data: T;

    message?: string;

}