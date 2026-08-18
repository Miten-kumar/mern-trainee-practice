import { Request, Response } from "express";
import { transformGalleryImage } from "../services/image.service";


export const transformImage = async (

    req:Request,

    res:Response

) => {

try {

    const id = req.params.id;

    if(!id || Array.isArray(id)){

        return res.status(400).json({

            success:false,

            message:"Invalid image id"

        });
    }

    const width =
        Number(req.query.w) || 640;

    const format =
        typeof req.query.fmt === "string"
        ? req.query.fmt
        : "jpeg";

    const image = await transformGalleryImage(

        id,

        width,

        format

    );

    res.setHeader(

        "Content-Type",

        `image/${format}`

    );

    res.setHeader(

        "Cache-Control",

        "public,max-age=31536000,immutable"
    );

    res.send(image);
}

catch(error){

    console.log(error);

    res.status(500).json({

        success:false,

        message:"Image transformation failed"

    });
}
};