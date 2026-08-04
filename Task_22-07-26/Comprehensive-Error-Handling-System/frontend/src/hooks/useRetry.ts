import {
    useState
}
from "react";

const useRetry = ()=>{

const [loading,setLoading]=
useState(false);

const [error,setError]=
// eslint-disable-next-line @typescript-eslint/no-explicit-any
useState<any>(null);


const executeRetry = async <T>(

    apiCall:()=>Promise<T>,

    retries:number=3,

    delay:number=1000

):Promise<T | undefined>=>{

    setLoading(true);

    setError(null);

    try{

        let attempt = 0;

        while(attempt < retries){

            try{
                const response =
                await apiCall();


                setLoading(false);

                return response;

            }
            catch(err){

                attempt++;

                if(attempt===retries){
                    throw err;
                }

                await new Promise(

                    resolve=>

                    setTimeout(

                        resolve,

                        delay * attempt

                    )

                );
            }

        }

    }

    catch(err){

        setError(err);

        throw err;
    }

    finally{


        setLoading(false);
    }
};

return {

executeRetry,

loading,

error

};

};

export default useRetry;