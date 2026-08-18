import {  useEffect } from "react";

const STORAGE_KEY =
"product-scroll-position";

export const useScrollRestoration = () => {

useEffect(()=>{

    const savedPosition =
        sessionStorage.getItem(
            STORAGE_KEY
        );

    if(savedPosition){

        window.scrollTo({

            top:
            Number(savedPosition),

            behavior:
            "instant"

        });
    }

    const saveScrollPosition =
    ()=>{


        sessionStorage.setItem(

            STORAGE_KEY,

            String(
                window.scrollY
            )

        );


    };

    window.addEventListener(

        "scroll",

        saveScrollPosition

    );

    return()=>{


        window.removeEventListener(

            "scroll",

            saveScrollPosition

        );


    };

},[]);

};