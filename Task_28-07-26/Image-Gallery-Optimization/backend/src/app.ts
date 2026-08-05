import express, {
    Application,
    Request,
    Response,
    NextFunction
} from "express";

import cors from "cors";

import path from "path";

import imageRoutes from "./routes/image.routes";



const app:Application = express();

// Middleware

app.use(

cors({

    origin:"http://localhost:5173",

    methods:[
        "GET",
        "POST"
    ],

    credentials:true

})

);

app.use(
express.json()
);

app.use(
express.urlencoded({
    extended:true
})
);

// Static images folder (optional)

app.use(

"/uploads",

express.static(

path.join(process.cwd(),"src/uploads")

)

);


// API Routes

app.use(

"/api/images",

imageRoutes

);

// Health Check API

app.get(

"/health",

(req:Request,res:Response)=>{

res.status(200).json({

    success:true,

    message:"Image service running"

});

}
);

// Global Error Handler

app.use(

(
err:any,

req:Request,

res:Response,

next:NextFunction

)=>{

console.error(err);

res.status(500).json({

    success:false,

    message:
    "Internal Server Error"

});

}

);

export default app;