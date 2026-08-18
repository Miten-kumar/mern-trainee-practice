import axios from "axios";

import type {
    ErrorLogPayload
} from "../types/error.types";

const API_URL =
import.meta.env.VITE_API_URL;



export const sendErrorLog = async (

    errorData: ErrorLogPayload

)=>{


    try {


        await axios.post(

            `${API_URL}/errors`,

            errorData

        );


    }

    catch(error){


        console.error(
            "Error logging failed",
            error
        );


    }


};