export type ErrorType =

    | "runtime"

    | "api"

    | "network"

    | "validation"

    | "authentication"

    | "authorization";


export interface ErrorLogPayload {


    message:string;


    stack?:string;


    type:ErrorType;


    page?:string;


    userAgent?:string;


    statusCode?:number;


    userId?:number;

}

export interface ApiErrorResponse {


    success:boolean;


    message:string;


    stack?:string;

}

export interface ApiResponse<T>{


    success:boolean;


    message:string;


    data:T;

}

export interface User {

    id:number;


    name:string;


    email:string;
}

export interface RetryConfig {


    retries:number;


    delay:number;

}

export interface NetworkStatus {


    isOnline:boolean;


}