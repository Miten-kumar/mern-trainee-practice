import cluster from "cluster";

import os from "os";



const cpuCount=os.cpus().length;



if(cluster.isPrimary){



console.log(
`Master PID ${process.pid}`
);



for(
let i=0;
i<cpuCount;
i++
){

cluster.fork();

}



cluster.on(
"exit",
(worker)=>{


console.log(
`Worker ${worker.process.pid} crashed`
);


cluster.fork();


});


}
else{


require("./server");


}