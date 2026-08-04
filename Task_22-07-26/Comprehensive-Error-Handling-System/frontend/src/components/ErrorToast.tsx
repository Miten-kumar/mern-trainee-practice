import toast from "react-hot-toast";

export const showErrorToast = (

message:string

)=>{


toast.error(

message,

{

duration:3000

}

);


};

export const showSuccessToast=(

message:string

)=>{


toast.success(

message

);


};