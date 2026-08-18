import type { GalleryImage } from "../types/image.types";


interface Props{

image:GalleryImage|null;

close:()=>void;

}


export default function Lightbox({

image,

close

}:Props){


if(!image)

return null;


return (

<div

className="lightbox"

role="dialog"

aria-modal="true"

>

<button

onClick={close}

aria-label="Close image"

>

×

</button>

<img

src={image.src.jpeg[2]}

alt={image.title}

/>

</div>

);


}