export interface Product {

    id:number;

    name:string;

    category:string;

    price:number;

    createdAt:Date;

}



export interface ProductQuery {

    category?:string;

    sort?: "asc" | "desc";

}