import { prisma } from "../config/database";

import { ApiError } from "../utils/apiError";


// Get all users

export const findUsers = async()=>{


    const users = await prisma.user.findMany({

        orderBy:{
            createdAt:"desc"
        }

    });


    return users;

};



// Get single user

export const findUserById = async(
    id:number
)=>{


    const user = await prisma.user.findUnique({

        where:{
            id
        }

    });



    if(!user){

        throw new ApiError(
            "User not found",
            404,
            "USER_NOT_FOUND"
        );

    }


    return user;

};




// Create user

export const createNewUser = async(
    data:{
        name:string;
        email:string;
    }
)=>{


    const existingUser =
    await prisma.user.findUnique({

        where:{
            email:data.email
        }

    });



    if(existingUser){

        throw new ApiError(
            "Email already exists",
            409,
            "EMAIL_EXISTS"
        );

    }



    const user =
    await prisma.user.create({

        data

    });



    return user;

};




// Update user

export const updateExistingUser =
async(
id:number,
data:any
)=>{


    await findUserById(id);



    const user =
    await prisma.user.update({

        where:{
            id
        },

        data

    });



    return user;

};




// Delete user

export const removeUser =
async(
id:number
)=>{


    await findUserById(id);



    await prisma.user.delete({

        where:{
            id
        }

    });


};