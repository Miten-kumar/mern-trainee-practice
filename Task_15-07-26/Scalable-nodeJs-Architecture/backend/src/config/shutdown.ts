import { Server } from "http";

export function gracefulShutdown(
server:Server
){

const shutdown=()=>{

console.log(
"Shutdown signal received"
);

server.close(()=>{

console.log(
"HTTP server closed"
);

process.exit(0);

});

};

process.on(
"SIGTERM",
shutdown
);

process.on(
"SIGINT",
shutdown
);

}