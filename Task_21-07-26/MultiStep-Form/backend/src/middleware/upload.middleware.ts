import { Request,Response,NextFunction } from "express";


export const uploadErrorHandler =
(
error:any,
req:Request,
res:Response,
next:NextFunction
)=>{

    if(error){

        return res.status(400).json({

            success:false,

            message:error.message

        });
    }

    next();

};