import {
Router
}
from "express";


import {
getPerformanceReport
}
from "../controllers/performance.controller";


import {
analyzeUserQuery
}
from "../services/query.service";



const router = Router();



// Performance report

router.get(

"/performance",

getPerformanceReport

);




// EXPLAIN ANALYZE test

router.get(

"/analyze-query",

async(req,res)=>{


try{


const result =
await analyzeUserQuery();



res.json({

success:true,

data:result

});


}

catch(error){


res.status(500)
.json({

success:false,

message:"Query analysis failed"

});


}


}

);



export default router;