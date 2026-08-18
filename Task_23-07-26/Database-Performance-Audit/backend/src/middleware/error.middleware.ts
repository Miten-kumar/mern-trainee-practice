import {
 Request,
 Response,
 NextFunction
} from "express";

import { logger } from "../utils/logger";

export const errorMiddleware = (

error:any,

req:Request,

res:Response,

next:NextFunction

)=>{


logger.error({

message:error.message,

stack:error.stack

});

res.status(
error.statusCode || 500
)
.json({

success:false,

message:
error.message ||
"Internal Server Error"

});

};