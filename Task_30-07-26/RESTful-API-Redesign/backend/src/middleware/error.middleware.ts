import {
    Request,
    Response,
    NextFunction
}
from "express";



export interface AppError extends Error {

    statusCode?: number;

    code?: string;

}



export const errorHandler = (

    err:AppError,

    req:Request,

    res:Response,

    next:NextFunction

)=>{


    const statusCode =

    err.statusCode || 500;



    const errorCode =

    err.code || "INTERNAL_SERVER_ERROR";



    res.status(statusCode)
    .json({

        success:false,


        error:{


            code:errorCode,


            message:
            err.message || 
            "Something went wrong",


            status:
            statusCode,


            path:
            req.originalUrl


        },


        timestamp:
        new Date().toISOString()


    });


};