import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
    "DATABASE_URL",
    "PORT"
];

requiredEnv.forEach((key)=>{

    if(!process.env[key]){
        throw new Error(
            `${key} environment variable is missing`
        );
    }

});

export const env = {

    PORT: Number(process.env.PORT),

    DATABASE_URL:
        process.env.DATABASE_URL as string,

};