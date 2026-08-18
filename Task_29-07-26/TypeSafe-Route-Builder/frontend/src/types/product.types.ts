export interface Product {

    id:number;

    name:string;

    category:string;

    price:number;

    createdAt:string;

}


export interface ProductQuery {

    category?:string;

    sort?: "asc" | "desc";

}