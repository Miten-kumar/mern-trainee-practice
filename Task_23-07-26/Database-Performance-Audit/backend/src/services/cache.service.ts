import { redisClient } from "../config/redis";

export const getCache = async(
    key:string
)=>{

    const data =
    await redisClient.get(key);

    return data;

};

export const setCache = async(

    key:string,

    value:any,

    expiry:number = 300

)=>{

    await redisClient.set(

        key,

        JSON.stringify(value),

        {

            EX:expiry

        }
    );
};

export const deleteCache = async(

    key:string

)=>{

    await redisClient.del(key);

};