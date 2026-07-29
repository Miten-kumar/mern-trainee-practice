export interface User {

    id:number;

    name:string;

    email:string;

    createdAt:string;

}



export interface CreateUserPayload {

    name:string;

    email:string;

}



export interface ApiResponse<T>{

    success:boolean;

    data:T;

    message?:string;

}