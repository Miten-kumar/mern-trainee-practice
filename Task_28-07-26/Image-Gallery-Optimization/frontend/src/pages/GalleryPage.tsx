import { useEffect, useState } from "react";
import { getImages } from "../api/imageApi";

import Gallery from "../components/Gallery";

import Lightbox from "../components/Lightbox";

import Loader from "../components/Loader";
import type { GalleryImage } from "../types/image.types";


export default function GalleryPage(){

const [

images,

setImages

]

=

useState<GalleryImage[]>([]);

const [

selectedImage,

setSelectedImage

]

=

useState<GalleryImage | null>(null);

useEffect(()=>{

    const fetchImages = async()=>{

        try{
            const data =
            await getImages();

            setImages(data);
        }

        catch(error){

            console.log(
                "Failed to load images",
                error
            );
        }
    };

    fetchImages();

},[]);


if(images.length===0){


    return <Loader/>;


}


return (

<>

<div className="gallery-header">

<h1>
Image Gallery
</h1>

<p>
Optimized images with WebP, Lazy Loading and Lightbox
</p>

</div>



<Gallery

images={images}

openLightbox={setSelectedImage}

/>



<Lightbox

image={selectedImage}

close={()=>setSelectedImage(null)}

/>


</>

);

}