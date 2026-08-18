import axios from "axios";


const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

    headers: {

        "Content-Type": "application/json"

    },

    timeout: 10000

});


// Request Interceptor

api.interceptors.request.use(

    (config)=>{

        // If authentication token is required later

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

// Response Interceptor

api.interceptors.response.use(

    (response)=>{

        return response;

    },

    (error)=>{

        if(error.response){

            console.log(
                "API Error:",
                error.response.data.message
            );

        }

        else if(error.request){

            console.log(
                "Network Error: Server not reachable"
            );


        }

        return Promise.reject(error);
    }


);

export default api;