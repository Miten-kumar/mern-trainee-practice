import { api } from "./client";
import type { Product, ProductQuery } from "../types/product.types";


export async function getProducts(
    query:ProductQuery
){
    
    const response =
    await api.get(
        "/products",
        {

            params:query

        }
    );

    return response.data.data as Product[];

}