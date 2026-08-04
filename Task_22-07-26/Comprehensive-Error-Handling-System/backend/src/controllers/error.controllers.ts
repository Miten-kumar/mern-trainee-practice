import { Request, Response } from "express";

import asyncHandler from "../middleware/asyncHandler";

import {

saveErrorLog,

getAllErrorLogs

}
from "../services/errorLogger.services";


export const createErrorLog = asyncHandler(

async(
req:Request,
res:Response
)=>{

const error =
await saveErrorLog(req.body);

res.status(201).json({

success:true,

message:"Error logged successfully",

data:error

});


}

);

export const getErrorLogs = asyncHandler(

async(
req:Request,
res:Response
)=>{

const logs =
await getAllErrorLogs();

res.status(200).json({

success:true,

data:logs

});

}

);