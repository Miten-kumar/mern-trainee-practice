export interface RateLimitConfig {

    windowSeconds:number;

    maxRequests:number;

    keyPrefix:string;

}