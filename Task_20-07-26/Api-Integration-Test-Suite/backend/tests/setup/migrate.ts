import { execSync } from "child_process";


export function runMigrations(){

 execSync(
  "npx prisma migrate deploy",
  {
    stdio:"inherit"
  }
 );

}