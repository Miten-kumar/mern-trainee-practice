import { PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient();


beforeAll(async () => {

  await prisma.$connect();

});


afterAll(async () => {

  await prisma.$disconnect();

});



export async function cleanDatabase(){

  const tables =
    await prisma.$queryRaw<
      { tablename:string }[]
    >`

    SELECT tablename 
    FROM pg_tables
    WHERE schemaname='public';

    `;


  for(const table of tables){

    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${table.tablename}" RESTART IDENTITY CASCADE`
    );

  }

}