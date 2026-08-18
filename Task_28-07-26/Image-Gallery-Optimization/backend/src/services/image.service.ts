import path from "path";

import { galleryData } from "../utils/galleryData";

import {
    processImage
} from "../utils/sharpProcessor";



export const getGalleryImages = () => {

    return galleryData;

};



export const transformGalleryImage = async (

    imageId:string,

    width:number,

    format:string

) => {


    const imagePath = path.join(

        process.cwd(),

        "src/uploads/images",

        `${imageId}.jpg`

    );


    const imageBuffer = await processImage(

        imagePath,

        width,

        format

    );


    return imageBuffer;

};