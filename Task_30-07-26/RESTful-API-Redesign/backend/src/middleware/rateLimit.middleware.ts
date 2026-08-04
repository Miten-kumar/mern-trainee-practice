import rateLimit from "express-rate-limit";


export const apiLimiter = rateLimit({

    // Time window
    windowMs: 15 * 60 * 1000, // 15 minutes

    // Maximum requests per IP
    max: 100,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        error: {

            code: "RATE_LIMIT_EXCEEDED",

            message:
            "Too many requests, please try again later"

        },

        timestamp:
        new Date().toISOString()

    }
});