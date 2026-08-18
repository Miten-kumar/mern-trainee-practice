import {
    useInfiniteQuery
} from "@tanstack/react-query";


import {
    fetchProducts
} from "../api/productApi";


import type {
    ProductResponse
} from "../types/product.types";



export const useInfiniteProducts = () => {


    return useInfiniteQuery({

        queryKey:[
            "products"
        ],


        queryFn:({
            pageParam
        }) =>

            fetchProducts(
                pageParam
            ),



        initialPageParam:
            undefined as string | undefined,



        getNextPageParam:
        (
            lastPage: ProductResponse
        ) => {


            return lastPage.hasMore

                ? lastPage.nextCursor

                : undefined;

        }

    });


};