import dotenv from "dotenv";

dotenv.config();

import app from "./app";



const PORT:number =

Number(process.env.PORT) || 3001;

app.listen(

PORT,

()=>{

console.log(
`
 Image Optimization Backend Started

Server:
http://localhost:${PORT}

API:
http://localhost:${PORT}/api/images

Health:
http://localhost:${PORT}/health

`

);


}

);