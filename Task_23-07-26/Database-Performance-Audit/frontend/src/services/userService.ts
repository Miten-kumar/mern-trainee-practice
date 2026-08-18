import apiClient from "../api/apiClient";

import type { User } from "../types";

interface UserResponse {

    success:boolean;

    count:number;

    data:User[];

}

export const getUsers = async():Promise<User[]> => {


    const response =
    await apiClient.get<UserResponse>(
        "/users"
    );


    return response.data.data;

};