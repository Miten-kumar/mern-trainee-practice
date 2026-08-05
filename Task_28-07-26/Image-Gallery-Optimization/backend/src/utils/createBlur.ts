import sharp from "sharp";



export async function generateBlurPlaceholder(

imagePath:string

){



const buffer = await sharp(imagePath)

.resize({

width:20

})

.blur(1)

.jpeg({

quality:40

})

.toBuffer();



const base64 =

buffer.toString("base64");



return `data:image/jpeg;base64,${base64}`;

}