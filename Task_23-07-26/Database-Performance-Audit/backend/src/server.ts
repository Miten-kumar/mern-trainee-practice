import dotenv from "dotenv";

dotenv.config();

import app from "./app";

import { connectDatabase } from "./config/database";
import { connectRedis } from "./config/redis";
import { logger } from "./utils/logger";

const PORT =
process.env.PORT || 5000;

async function startServer(){

    try {

        // PostgreSQL Connection

        await connectDatabase();


        // Redis Connection

        await connectRedis();

        app.listen(

            PORT,

            ()=>{


                logger.info(

                    `Server running on port ${PORT}`

                );
            }

        );
    }

    catch(error){

        logger.error(
            "Server startup failed",
            error
        );

        process.exit(1);

    }
}

startServer();