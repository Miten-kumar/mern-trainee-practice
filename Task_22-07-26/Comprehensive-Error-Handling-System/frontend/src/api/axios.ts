import axios, { AxiosError } from "axios";
import { sendErrorLog } from "../services/errorLogger.service";

const api = axios.create({

    baseURL:
        import.meta.env.VITE_API_URL,

    timeout:10000,

    headers:{

        "Content-Type":
        "application/json"
    }
});

// ==========================
// Request Interceptor
// ==========================

api.interceptors.request.use(

    (config)=>{
        const token =
        localStorage.getItem("token");

        if(token){

            config.headers.Authorization =
            `Bearer ${token}`;

        }
        return config;
    },

    (error)=>{

        return Promise.reject(error);

    }

);

// ==========================
// Response Interceptor
// ==========================

api.interceptors.response.use(

    (response)=>{

        return response;

    },

    async(error:AxiosError)=>{

        let errorMessage =
        "Something went wrong";

        let errorType:
        "api" |
        "network" |
        "authentication" = "api";

        // Network Error

        if(!error.response){

            errorMessage =
            "Network error. Please check your internet connection";

            errorType="network";

        }
        // Backend Response Error

        else{
            const status =
            error.response.status;

            if(status===401){

                errorMessage =
                "Unauthorized. Please login again";


                errorType="authentication";
            }

            else if(status===403){

                errorMessage =
                "You don't have permission";

            }

            else if(status>=500){

                errorMessage =
                "Server error. Try again later";
            }

            else{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data:any =
                error.response.data;


                errorMessage =
                data?.message ||
                errorMessage;

            }
        }

        // Send Error To Backend Logging API

        sendErrorLog({

            message:errorMessage,

            type:errorType,

            page:window.location.pathname,

            userAgent:
            navigator.userAgent


        }).catch(()=>{});

        return Promise.reject({

            message:errorMessage,

            status:
            error.response?.status

        });


    }

);

export default api;