import api from "./axios";
import type { User, ApiResponse } from "../types/user.types";


// GET ALL USERS

export const getUsers = async()=>{

    const response =
    await api.get<ApiResponse<User[]>>(
        "/users"
    );

    return response.data;
};

// GET USER BY ID

export const getUserById =
async(
    id:number
)=>{

    const response =
    await api.get<ApiResponse<User>>(
        `/users/${id}`
    );

    return response.data;
};

// CREATE USER

export const createUser =
async(
    userData:{
        name:string;
        email:string;
    }
)=>{

    const response =
    await api.post<ApiResponse<User>>(

        "/users",

        userData

    );
 return response.data;
};

// UPDATE USER

export const updateUser =
async(

    id:number,

    userData:{
        name?:string;
        email?:string;
    }

)=>{

    const response =
    await api.patch<ApiResponse<User>>(

        `/users/${id}`,

        userData

    );
    return response.data;

};

// DELETE USER

export const deleteUser =
async(
    id:number
)=>{

    const response =
    await api.delete(

        `/users/${id}`

    );
    return response.data;

};