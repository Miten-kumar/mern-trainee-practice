import api from "../api/axios";

import type {
    ApiResponse,
    User,
} from "../types/error.types";

// Get All Users

export const getUsers = async()=>{

    const response =
        await api.get<ApiResponse<User[]>>(
            "/users"
        );

    return response.data;

};

// Get Single User

export const getUserById = async(

    id:number

)=>{

    const response =
        await api.get<ApiResponse<User>>(
            `/users/${id}`
        );

    return response.data;

};

// Create User

export const createUser = async(

    user:{
        name:string;
        email:string;
    }

)=>{

    const response =
        await api.post<ApiResponse<User>>(
            "/users",
            user
        );


    return response.data;

};