import csrf from "csurf";
import cookieParser from "cookie-parser";


export const csrfProtection = [

cookieParser(),


csrf({

    cookie:{
        httpOnly:true,

        secure:
        process.env.NODE_ENV==="production",

        sameSite:"strict"

    }

})

];