import { prisma } from "../config/database";

export const getUsers = async () => {

    const users = await prisma.user.findMany({

        include: {

            orders: true
        }

    });

    return users;
};

export const getUserById = async (
    id:number
) => {

    const user = await prisma.user.findUnique({

        where:{
            id
        },

        include:{

            orders:true

        }

    });

    return user;

};