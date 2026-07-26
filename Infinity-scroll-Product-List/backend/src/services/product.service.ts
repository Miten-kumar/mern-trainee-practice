import prisma from "../config/database";


export const getProducts = async (

cursor?: string,

limit:number = 10

)=>{


const products =
await prisma.product.findMany({

    take: limit + 1,


    ...(cursor && {

        skip:1,

        cursor:{
            id:cursor
        }

    }),



    orderBy:{

        createdAt:"asc"

    }

});



let nextCursor:null | string = null;



if(products.length > limit){


    const nextItem =
    products.pop();


    nextCursor =
    nextItem!.id;


}



return {


    products,


    nextCursor,


    hasMore:
    nextCursor !== null


};


};