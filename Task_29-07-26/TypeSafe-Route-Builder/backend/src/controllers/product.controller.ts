import { Request, Response } from "express";
import { getProducts } from "../services/product.service";

export async function fetchProducts(

req:Request,

res:Response

){

    const {

        category,

        sort

    } = req.query;


    const products =
    await getProducts({

        category:
        category as string | undefined,


        sort:
        sort === "desc"
        ?
        "desc"
        :
        "asc"

    });

    res.status(200)
    .json({

        success:true,

        data:products

    });


}