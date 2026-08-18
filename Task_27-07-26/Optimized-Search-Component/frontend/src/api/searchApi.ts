import axios from "axios";
import type { Product } from "../types/search.types";


const apiClient = axios.create({

    baseURL: "http://localhost:5000/api",

    headers: {
        "Content-Type": "application/json"
    }

});

export const searchProducts = async (

    query: string,

    signal?: AbortSignal

): Promise<Product[]> => {

    const response = await apiClient.get(

        "/search",

        {
            params: {
                q: query
            },

            signal

        }

    );

    return response.data.data;

};