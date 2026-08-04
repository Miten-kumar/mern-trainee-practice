import { Request, Response } from "express";
import { createUser, getUserById, getUsers } from "../services/user.service";
import { CreateUserRequest, ApiResponse, UserResponse } from "../types/user.types";


export async function fetchUsers(
    req: Request,
    res: Response<ApiResponse<UserResponse[]>>
) {

    const users =
        await getUsers();

    res.status(200)
        .json({

            success:true,

            data:users

        });
}


export async function fetchUserById(
    req: Request,
    res: Response<ApiResponse<UserResponse>>
) {

    const id =
        Number(req.params.id);

    const user =
        await getUserById(id);

    if(!user){

        res.status(404)
        .json({

            success:false,

            data:{} as UserResponse,

            message:"User not found"

        });
        return;
    }

    res.status(200)
    .json({

        success:true,

        data:user

    });
}

export async function addUser(
    req: Request<{}, {}, CreateUserRequest>,
    res: Response<ApiResponse<UserResponse>>
) {

    const {
        name,
        email
    } = req.body;

    const user =
        await createUser(
            name,
            email
        );

    res.status(201)
    .json({

        success:true,

        data:user

    });
}