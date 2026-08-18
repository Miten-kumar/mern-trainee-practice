import type { ErrorType } from "../types/error.types";


const analytics: Record<ErrorType, number> = {

    runtime:0,

    api:0,

    network:0,

    validation:0,

    authentication:0,

    authorization:0

};

export const trackError = (

    type: ErrorType

) => {

    analytics[type]++;

    console.log(
        "Error Analytics",
        analytics
    );

};

export const getAnalytics = () => {

    return analytics;

};