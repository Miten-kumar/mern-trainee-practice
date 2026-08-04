import axios from "axios";

const apiClient = axios.create({

    // Backend API URL
    baseURL: import.meta.env.VITE_API_URL,

    headers: {

        "Content-Type": "application/json"

    },

    timeout: 10000

});

// Request Interceptor
apiClient.interceptors.request.use(

    (config)=>{

        console.log(
            "API Request:",
            config.method,
            config.url
        );


        return config;

    },

    (error)=>{

        return Promise.reject(error);

    }

);

// Response Interceptor
apiClient.interceptors.response.use(

    (response)=>{


        console.log(
            "API Response:",
            response.status
        );


        return response;

    },

    (error)=>{


        if(error.response){

            console.log(
                "API Error:",
                error.response.data
            );

        }

        else if(error.request){

            console.log(
                "Network Error: Backend not reachable"
            );

        }

        else{

            console.log(
                "Request Error:",
                error.message
            );

        }
        return Promise.reject(error);

    }

);

export default apiClient;