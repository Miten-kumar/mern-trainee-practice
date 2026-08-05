import type { GalleryImage } from "../types/image.types";


interface Props{

image:GalleryImage;

loading:"lazy"|"eager";

onClick?:()=>void;

}


export default function OptimizedImage({

image,

loading,

onClick

}:Props){


return (

<div

className="image-wrapper"

style={{

aspectRatio:image.aspectRatio

}}

onClick={onClick}

>

<picture>

<source

type="image/webp"

srcSet={

image.src.webp.join(",")

}

/>


<img

src={

image.src.jpeg[1]

}

alt={image.title}

loading={loading}

decoding="async"

className="main-image"

/>

</picture>

</div>

)

}