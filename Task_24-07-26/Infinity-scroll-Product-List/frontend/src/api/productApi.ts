import api from "../config/axios";

import type { ProductResponse } from "../types/product.types";

export const fetchProducts = async (

    cursor?: string

): Promise<ProductResponse> => {

    const response = await api.get(
        "/products",
        {

            params: {

                cursor,

                limit: 10

            }

        }
    );

    return response.data.data;

};