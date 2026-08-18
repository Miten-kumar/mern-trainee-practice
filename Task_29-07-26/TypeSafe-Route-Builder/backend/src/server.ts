import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

async function startServer(){

    try{

        // PostgreSQL connection

        await prisma.$connect();

        console.log(
            "PostgreSQL connected"
        );

        app.listen(
            Number(env.PORT),
            ()=>{

                console.log(
                    `Backend running on http://localhost:${env.PORT}`
                );
            }
        );

    }
    catch(error){

        console.error(
            "Server startup failed",
            error
        );

        await prisma.$disconnect();

        process.exit(1);

    }
}

startServer();