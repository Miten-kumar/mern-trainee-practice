import helmet from "helmet";


export const securityHelmet = helmet({

    contentSecurityPolicy:{

        directives:{

            defaultSrc:["'self'"],

            scriptSrc:["'self'"],

            objectSrc:["'none'"]

        }
    },

    frameguard:{
        action:"deny"
    },

    hsts:{
        maxAge:31536000,
        includeSubDomains:true
    }

});