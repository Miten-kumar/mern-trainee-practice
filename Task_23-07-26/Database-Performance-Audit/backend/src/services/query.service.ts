import { prisma } from "../config/database";

export const analyzeUserQuery = async()=>{

    const result =
    await prisma.$queryRaw`

    EXPLAIN ANALYZE

    SELECT *

    FROM "User"

    WHERE email='test@gmail.com';

    `;

    return result;

};