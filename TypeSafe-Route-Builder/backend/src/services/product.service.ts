import { prisma } from "../config/prisma";
import { ProductQuery } from "../types/product.types";


export async function getProducts(
    query:ProductQuery
){
    
    return prisma.product.findMany({

        where:{

            category:
            query.category

        },

        orderBy:{

            price:
            query.sort ?? "asc"

        }

    });
}