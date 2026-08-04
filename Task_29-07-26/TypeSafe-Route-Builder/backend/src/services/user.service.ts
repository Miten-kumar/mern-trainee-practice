import { prisma } from "../config/prisma";


export async function getUsers() {

    return prisma.user.findMany({

        orderBy: {
            createdAt: "desc"
        }
    });
}

export async function getUserById(
    id: number
) {
    return prisma.user.findUnique({

        where: {
            id
        }
    });
}

export async function createUser(
    name: string,
    email: string
) {

    return prisma.user.create({

        data: {

            name,
            email

        }
    });
}