import { Request, Response } from "express";
import { getGalleryImages } from "../services/image.service";


export const getImages = (
    
    req:Request,
    res:Response

) => {

    try {

        const images =
        getGalleryImages();

        res.status(200).json({

            success:true,

            data:images

        });
    }

    catch(error){

        res.status(500).json({

            success:false,

            message:"Failed to fetch images"

        });
    }
};