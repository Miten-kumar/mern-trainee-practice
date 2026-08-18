import api from "./axios";

const delay = (ms:number)=>

new Promise(
(resolve)=>
setTimeout(resolve,ms)
);

export const retryApi = async <T>(

    apiCall:()=>Promise<T>,

    retries:number=3,

    delayTime:number=1000

):Promise<T>=>{

    try{
        return await apiCall();
    }

    catch(error){

       if(retries===0){

            throw error;
        }

        await delay(delayTime);

        return retryApi(

            apiCall,

            retries-1,

            delayTime*2

        );

    }
};

// Example API Retry Function

export const retryGet = (

    url:string

)=>{
    return retryApi(

        ()=>api.get(url)

    );
};