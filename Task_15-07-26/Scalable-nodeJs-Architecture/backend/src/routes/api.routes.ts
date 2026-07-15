import {
 Router
} from "express";


import {
 healthCheck
} from "../controller/health.controller";


const router=Router();



router.get(
"/health",
healthCheck
);



router.get(
"/users",
(req,res)=>{


let count=0;


for(let i=0;i<100000;i++)
{
    count+=i;
}



res.json({

users:[
"John",
"Alex"
],

pid:process.pid

});


});


export default router;