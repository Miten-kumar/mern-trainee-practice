import { Request, Response, NextFunction } from "express";
import {
    findUsers,
    findUserById,
    createNewUser,
    updateExistingUser,
    removeUser
}
from "../services/user.service";

import { successResponse } from "../utils/apiResponse";
import { addHateoasLinks } from "../utils/hateoas";


// GET ALL USERS

export const getUsers = async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{

    try{

        const users =
        await findUsers();

        const usersWithLinks =
        users.map(user =>
            addHateoasLinks(user)
        );

        res
        .status(200)
        .json(

            successResponse(
                usersWithLinks,
                "Users fetched successfully"
            )
        );
    }
    catch(error){

        next(error);
    }
};


// GET USER BY ID

export const getUserById = async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{


    try{

        const user =
        await findUserById(
            Number(req.params.id)
        );

        res
        .status(200)
        .json(

            successResponse(
                addHateoasLinks(user),
                "User fetched successfully"
            )
        );
    }
    catch(error){

        next(error);

    }
};

// CREATE USER

export const createUser = async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{


    try{

        const user =
        await createNewUser(
            req.body
        );

        res
        .status(201)
        .json(

            successResponse(
                addHateoasLinks(user),
                "User created successfully"
            )
        );
    }
    catch(error){

        next(error);

    }
};

// UPDATE USER

export const updateUser = async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{


    try{

        const user =
        await updateExistingUser(

            Number(req.params.id),

            req.body
        );

        res
        .status(200)
        .json(

            successResponse(
                addHateoasLinks(user),
                "User updated successfully"
            )
        );

    }
    catch(error){

        next(error);

    }
};

// DELETE USER

export const deleteUser = async(
    req: Request,
    res: Response,
    next: NextFunction
)=>{

    try{

        await removeUser(
            Number(req.params.id)
        );

        res
        .status(204)
        .send();
    }
    catch(error){

        next(error);
    }
};