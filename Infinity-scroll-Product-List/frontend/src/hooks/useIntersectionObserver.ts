import {
    useEffect,
    useRef
} from "react";



export const useIntersectionObserver = (

    callback:()=>void

)=>{


    const targetRef =
        useRef<HTMLDivElement | null>(
            null
        );



    useEffect(()=>{


        const element =
            targetRef.current;



        if(!element)
            return;



        const observer =
            new IntersectionObserver(

                (entries)=>{


                    if(
                        entries[0].isIntersecting
                    ){

                        callback();

                    }


                },

                {
                    threshold:0.5
                }

            );



        observer.observe(
            element
        );



        return()=>{


            observer.disconnect();


        };



    },[callback]);



    return targetRef;


};