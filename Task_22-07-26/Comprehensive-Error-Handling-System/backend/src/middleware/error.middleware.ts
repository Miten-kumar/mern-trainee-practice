import {
    Request,
    Response,
    NextFunction
}
from "express";
import logger from "../config/logger";
import ApiError from "../utils/ApiError";


const errorMiddleware = (

    error: any,

    req: Request,

    res: Response,

    next: NextFunction

) => {

    let statusCode = 500;

    let message =
        "Internal Server Error";

    if(error instanceof ApiError){

        statusCode =
            error.statusCode;


        message =
            error.message;

    }

    // Prisma Error Handling

    if(error.code === "P2002"){


        statusCode = 409;


        message =
        "Duplicate value already exists";


    }

    logger.error({

        message:error.message,

        stack:error.stack,

        url:req.originalUrl,

        method:req.method

    });

    res.status(statusCode)
    .json({

        success:false,

        message,

        ...(process.env.NODE_ENV==="development" && {

            stack:error.stack

        })
    });
};

export default errorMiddleware;