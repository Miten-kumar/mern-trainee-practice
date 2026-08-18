import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import prisma from "./config/prisma";
import logger from "./config/logger";

const PORT = process.env.PORT || 5000;

const connectDatabase = async()=>{

    try{

        await prisma.$connect();

        logger.info(
            "PostgreSQL Database Connected"
        );

    }catch(error){

        logger.error({

            message:"Database connection failed",

            error

        });

        process.exit(1);
    }

};


const startServer = async()=>{

    await connectDatabase();

    app.listen(
        PORT,
        ()=>{
            logger.info(
                `Server running on port ${PORT}`
            );
        }
    );

};


startServer();