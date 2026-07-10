import { Request, Response } from "express";
import { getUsers } from "../services/userServices";

export const fetchUser = async(req:Request, res:Response)=>{
    try {
        const users = await getUsers();
        res.json(users);
    }
    catch(error){
        res.status(500).json({
            message: "Server error"
        });
    }
};