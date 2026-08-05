import axios from "axios";

import type {
    GalleryImage
} from "../types/image.types";


const API_URL =
"http://localhost:3001/api";


const imageApi = axios.create({

    baseURL:API_URL

});



export const getImages = async()=>{


const response =
await imageApi.get("/images");



const images:GalleryImage[] =
response.data.data.map(
(image:GalleryImage)=>({


...image,


src:{


webp:image.src.webp.map(
(url)=>`http://localhost:3001${url}`
),


jpeg:image.src.jpeg.map(
(url)=>`http://localhost:3001${url}`
)


}



})

);



return images;


};



export default imageApi;