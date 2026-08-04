import { createClient } from "redis";


export const redisClient = createClient({

  url: process.env.REDIS_URL

});


redisClient.on(
  "connect",
  () => {

    console.log(
      "Redis Connected Successfully"
    );

  }
);


redisClient.on(
  "error",
  (error)=>{

    console.error(
      "Redis Error:",
      error
    );

  }
);



export async function connectRedis(){

  try {

    await redisClient.connect();

  }
  catch(error){

    console.error(
      "Redis Connection Failed",
      error
    );

  }

}