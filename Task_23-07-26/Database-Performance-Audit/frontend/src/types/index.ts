export interface Order {


    id:number;


    amount:number;


    status:string;


}

export interface User {


    id:number;


    name:string;


    email:string;


    createdAt:string;


    orders:Order[];


}

export interface PerformanceReport {

    before:string;

    after:string;

    improvement:string;

}