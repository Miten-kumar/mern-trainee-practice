export const successResponse = (

    data:any,

    message:string="Success"

)=>{

    
return {

    success:true,

    message,

    data,

    timestamp:
    new Date().toISOString()

};

};

export const errorResponse = (

    message:string,

    code:string

)=>{


return {


    success:false,

    error:{

        message,

        code

    },

    timestamp:
    new Date().toISOString()
};
};