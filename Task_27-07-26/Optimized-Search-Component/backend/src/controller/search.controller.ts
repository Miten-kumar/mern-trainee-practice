import { Request, Response } from "express";
import { searchProducts } from "../services/search.service";

export const searchController = async (
    req: Request,
    res: Response
) => {

    try {

        const query = req.query.q as string;

        // Empty search handling
        if (!query || query.trim().length === 0) {

            return res.status(200).json([]);

        }

        // Minimum character optimization
        if (query.length < 2) {

            return res.status(200).json([]);

        }

        const products = await searchProducts(query);

        return res.status(200).json({

            success: true,

            count: products.length,

            data: products

        });

    } catch (error) {


        console.error(
            "Search Controller Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Internal server error while searching products"

        });
    }
};