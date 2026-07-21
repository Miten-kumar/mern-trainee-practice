import axios from "axios";


const api = axios.create({

  baseURL:
    "http://localhost:5000/api",

  withCredentials:true

});



// Request interceptor

api.interceptors.request.use(

  (config)=>{


    // Agar FormData hai to header manually mat set karo

    if(
      config.data instanceof FormData
    ){

      delete config.headers["Content-Type"];

    }
    else{

      config.headers["Content-Type"] =
        "application/json";

    }



    return config;

  },


  (error)=>{

    return Promise.reject(error);

  }

);



api.interceptors.response.use(

  (response)=>{

    return response;

  },


  (error)=>{


    console.log(
      "API Error:",
      error.response?.data || error.message
    );


    return Promise.reject(error);


  }

);



export default api;