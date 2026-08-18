import OptimizedImage from "./OptimizedImage";

import type { GalleryImage } from "../types/image.types";


interface Props{

images:GalleryImage[];

openLightbox:(image:GalleryImage)=>void;

}

export default function Gallery({

images,

openLightbox

}:Props){


return (

<div className="gallery">

{

images.map(

(image,index)=>(


<OptimizedImage

key={image.id}


image={image}


loading={

index < 4

?

"eager"

:

"lazy"

}


onClick={()=>openLightbox(image)}


/>


)

)

}

</div>

);

}