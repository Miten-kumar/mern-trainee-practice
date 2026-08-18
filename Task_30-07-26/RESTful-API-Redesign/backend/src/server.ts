import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";


const startServer = async()=>{

    try{

        // Database Connection

        await connectDatabase();

        // Start Server

        app.listen(
            env.PORT,
            ()=>{

                console.log(
                    `Server running on port ${env.PORT}`
                );

                console.log(
                    ` Swagger Docs:
                    http://localhost:${env.PORT}/api-docs`
                );
            }
        );
    }
    catch(error){

        console.error(
            "Server startup failed",
            error
        );

        process.exit(1);
    }
};

startServer();