import { Request, Response } from "express";

import prisma from "../config/prisma";

import asyncHandler from "../middleware/asyncHandler";

import ApiError from "../utils/ApiError";


// GET ALL USERS
export const getUsers = asyncHandler(
    async (
        req: Request,
        res: Response
    ) => {

        const users = await prisma.user.findMany();

        res.status(200).json({

            success: true,

            message: "Users fetched successfully",

            data: users

        });


    }
);

// GET SINGLE USER

export const getUserById = asyncHandler(
    async (
        req: Request,
        res: Response
    ) => {

        const userId = Number(req.params.id);

        const user = await prisma.user.findUnique({

            where:{
                id:userId
            }

        });

        if(!user){

            throw new ApiError(
                404,
                "User not found"
            );
        }

        res.status(200).json({

            success:true,

            data:user
        });

    }
);

// CREATE USER

export const createUser = asyncHandler(
    async(
        req:Request,
        res:Response
    )=>{

        const {
            name,
            email
        } = req.body;

        const existingUser =
            await prisma.user.findUnique({

                where:{
                    email
                }

            });

        if(existingUser){

            throw new ApiError(
                409,
                "Email already exists"
            );

        }

        const user =
            await prisma.user.create({

                data:{
                    name,
                    email
                }

            });

        res.status(201).json({

            success:true,

            message:"User created successfully",

            data:user

        });
    }
);
