import {
    Request,
    Response,
    NextFunction
} from "express";


import { logger }
from "../utils/logger";

export const performanceMiddleware = (

    req:Request,

    res:Response,

    next:NextFunction

)=>{
    const startTime = Date.now();

    res.on(
        "finish",
        ()=>{

            const endTime =
            Date.now() - startTime;

            logger.info({

                method:req.method,

                route:req.originalUrl,

                statusCode:res.statusCode,

                responseTime:`${endTime}ms`

            });
        }
    );

    next();

};