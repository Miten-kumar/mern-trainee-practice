import prisma from "../config/prisma";
import { ProductSearchResult } from "../types/search.types";


export const searchProducts = async (
    query: string
): Promise<ProductSearchResult[]> => {

    const products = await prisma.product.findMany({

        where: {

            OR: [

                {
                    name: {

                        contains: query,

                        mode: "insensitive"

                    }
                },

                {
                    category: {

                        contains: query,

                        mode: "insensitive"

                    }
                }
            ]
        },

        select: {

            id: true,

            name: true,

            category: true,

            description: true,

            createdAt: true

        },

        take: 10,

        orderBy: {

            name: "asc"
        }

    });

    return products;
};