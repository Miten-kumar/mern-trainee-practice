import dotenv from "dotenv";
import { z } from "zod";


dotenv.config();


const envSchema = z.object({

    DATABASE_URL:z.string(),

    PORT:z.string()
        .default("5000"),

    FRONTEND_URL:z.string()
        .default("http://localhost:5173")

});


export const env =
envSchema.parse({

    DATABASE_URL:
    process.env.DATABASE_URL,


    PORT:
    process.env.PORT,


    FRONTEND_URL:
    process.env.FRONTEND_URL

});