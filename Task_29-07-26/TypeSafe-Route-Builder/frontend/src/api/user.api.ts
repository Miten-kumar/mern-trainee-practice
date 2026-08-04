import { api } from "./client";
import type { ApiResponse, User, CreateUserPayload } from "../types/user.types";


export async function getUsers(){

    const response =
        await api.get<ApiResponse<User[]>>(
            "/users"
        );


    return response.data;
}

export async function getUserById(
    id:number
){

    const response =
        await api.get<ApiResponse<User>>(
            `/users/${id}`
        );

    return response.data;
}


export async function createUser(
    payload:CreateUserPayload
){

    const response =
        await api.post<ApiResponse<User>>(
            "/users",
            payload
        );

    return response.data;
}