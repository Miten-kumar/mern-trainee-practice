import { Request, Response } from "express";
import { getUsers } from "../services/user.services";
import { logger } from "../utils/logger";

export const fetchUsers = async (
    req: Request,
    res: Response
) => {

    try {
        const users = await getUsers();

        res.status(200).json({

            success: true,

            count: users.length,

            data: users

        });


    } catch (error) {

        logger.error(
            "Fetch users error",
            error
        );

        res.status(500).json({

            success:false,

            message:"Failed to fetch users"

        });

    }

};