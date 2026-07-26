import { Request, Response, NextFunction } from "express";

import {
    getProducts
} from "../services/product.service";


/**
 * @description Get Products with Cursor Pagination
 * @route GET /api/products
 */
export const fetchProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {


        const cursor = 
            req.query.cursor as string | undefined;


        const limit =
            Number(req.query.limit) || 10;



        const products =
            await getProducts(
                cursor,
                limit
            );



        res.status(200).json({

            success: true,

            message:
                "Products fetched successfully",

            data: products

        });



    } catch (error) {


        next(error);


    }

};