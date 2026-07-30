// HATEOAS LINK

export interface HateoasLink {


    rel:string;


    href:string;


    method:

    "GET"

    |

    "POST"

    |

    "PATCH"

    |

    "PUT"

    |

    "DELETE";


}






// USER RESOURCE

export interface User {


    id:number;


    name:string;


    email:string;



    createdAt?:string;


    updatedAt?:string;



    _links?:HateoasLink[];


}







// CREATE USER REQUEST

export interface CreateUserRequest {


    name:string;


    email:string;


}







// UPDATE USER REQUEST

export interface UpdateUserRequest {


    name?:string;


    email?:string;


}







// GENERIC API RESPONSE


export interface ApiResponse<T>{


    success:boolean;


    message:string;


    data:T;


    timestamp?:string;


}







// PAGINATION META


export interface PaginationMeta {


    page:number;


    limit:number;


    total:number;


    totalPages:number;


    hasNextPage?:boolean;


    hasPreviousPage?:boolean;


}







// PAGINATED RESPONSE


export interface PaginatedResponse<T>{


    success:boolean;


    message:string;


    data:T[];


    meta:PaginationMeta;


    timestamp:string;


}







// API ERROR RESPONSE


export interface ApiErrorResponse{


    success:false;



    error:{


        code:string;


        message:string;


        status:number;


        path:string;


    };



    timestamp:string;


}