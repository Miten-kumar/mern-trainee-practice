// Express Request User type
export interface IUser {

    id: string;

    name: string;

    email: string;

}



// API Response standard format
export interface ApiResponse<T> {

    success: boolean;

    message: string;

    data?: T;

    timestamp: string;

}



// Health Check Response
export interface HealthResponse {

    status: "UP" | "DOWN";

    pid: number;

    uptime: number;

    timestamp: string;

}



// Custom Application Error
export interface ErrorResponse {

    success: boolean;

    message: string;

    statusCode: number;

    timestamp: string;

}



// Environment Configuration
export interface EnvironmentConfig {

    NODE_ENV: string;

    PORT: number;

}



// Pagination Type
export interface Pagination {

    page: number;

    limit: number;

    total: number;

}



// Generic API Request
export interface ApiRequest<T> {

    body: T;

    params?: Record<string,string>;

    query?: Record<string,string>;

}