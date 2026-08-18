import axios from "axios";


const api = axios.create({

    baseURL:
    import.meta.env.VITE_API_URL,

    headers:{
        "Content-Type":"application/json"
    },

    timeout:10000

});


// Request Interceptor

api.interceptors.request.use(

(config)=>{

    // If JWT token is added later

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

        console.error(
            "API Error:",
            error.response.data
        );
    }
    else{

        console.error(
            "Network Error"
        );
    }
    return Promise.reject(error);
}

);

export default api;