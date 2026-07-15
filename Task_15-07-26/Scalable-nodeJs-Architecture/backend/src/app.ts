import express, {
    Application
} from "express";

import apiRoutes from "./routes/api.routes";


const app:Application = express();


app.use(express.json());


app.use("/api",apiRoutes);



app.get("/",(req,res)=>{

    res.json({

        message:"Server running",

        pid:process.pid

    });

});


export default app;