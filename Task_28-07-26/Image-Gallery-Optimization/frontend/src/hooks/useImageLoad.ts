import { useState } from "react";


export const useImageLoad = () => {

    const [loaded,setLoaded] = 
    useState<boolean>(false);

    const onLoad = () => {

        setLoaded(true);

    };

    return {

        loaded,

        onLoad
    };
};