import sharp from "sharp";


export async function processImage(

imagePath:string,

width:number,

format:string

):Promise<Buffer>{


let image = sharp(imagePath)

.resize({

width,

withoutEnlargement:true

});

switch(format){

case "webp":

return await image

.webp({

quality:82

})

.toBuffer();


case "avif":

return await image

.avif({

quality:65

})

.toBuffer();


case "jpeg":

default:

return await image

.jpeg({

quality:85,

progressive:true

})

.toBuffer();

}

}