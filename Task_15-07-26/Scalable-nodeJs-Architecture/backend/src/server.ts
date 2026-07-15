import app from "./app";

import {
 gracefulShutdown
} from "./config/shutdown";


const PORT:number =
Number(process.env.PORT) || 3000;



const server =
app.listen(PORT,()=>{


console.log(
`
Server running

Port:${PORT}

PID:${process.pid}
`
);


});



gracefulShutdown(server);