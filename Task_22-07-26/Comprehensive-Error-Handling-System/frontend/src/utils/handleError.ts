import { AxiosError } from "axios";


export const handleError = (

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error:any

)=>{

    if(error instanceof AxiosError){

        if(!error.response){


            return {

                type:"network",

                message:
                "Network connection failed"

            };

        }

        switch(error.response.status){

            case 400:

                return {

                    type:"validation",

                    message:
                    "Invalid request"

                };

            case 401:

                return {

                    type:"authentication",

                    message:
                    "Please login again"

                };

            case 403:

                return {

                    type:"authorization",

                    message:
                    "Access denied"

                };

            case 500:

                return {

                    type:"api",

                    message:
                    "Server error"

                };

            default:
                return {

                    type:"api",

                    message:
                    "Something went wrong"

                };
        }

    }

    return {

        type:"runtime",

        message:
        error.message ||
        "Unknown error"


    };

};