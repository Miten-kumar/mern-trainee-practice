import prisma from "../config/prisma";
import { ErrorLogPayload } from "../types/error.types";

export const saveErrorLog = async (

    errorData: ErrorLogPayload

) => {

    const errorLog = await prisma.errorLog.create({

        data:{
            message:
            errorData.message,


            stack:
            errorData.stack,


            type:
            errorData.type,


            page:
            errorData.page,


            userAgent:
            errorData.userAgent,


            userId:
            errorData.userId
        }

    });

    return errorLog;

};

export const getAllErrorLogs = async()=>{

    const logs =
        await prisma.errorLog.findMany({

            orderBy:{

                createdAt:"desc"

            }
        });

    return logs;

};