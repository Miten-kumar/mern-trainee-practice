export interface ErrorResponse {

    success:boolean;

    message:string;

    stack?:string;

}

export interface ErrorLogPayload {


    message:string;


    stack?:string;


    type:
    | "runtime"
    | "api"
    | "network"
    | "validation"
    | "authentication";


    page?:string;


    userAgent?:string;


    userId?:number;

}