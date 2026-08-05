export interface ImageSource {
    
    webp:string[];

    jpeg:string[];

    avif?:string[];
}

export interface GalleryImage {

    id:string;

    title:string;

    description?:string;

    width:number;

    height:number;

    aspectRatio:number;

    blurDataUrl:string;

    src:ImageSource;

}