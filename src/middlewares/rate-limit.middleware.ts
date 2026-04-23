import { rateLimiter } from "hono-rate-limiter";

// for authentication we are using strict rate limits
export const authRateLimit = rateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 10, // limit each IP to 10 requests per windowMs
    keyGenerator: (c) => {
        const forwardedFor = c.req.header("x-forwarded-for");
        const realIp = c.req.header("x-real-ip");
        return forwardedFor ?? realIp ?? "unknown";
    },
});

export const redirectRateLimit = rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 100, // limit each IP to 100 requests per windowMs
    keyGenerator: (c) => {
        const forwardedFor = c.req.header("x-forwarded-for");
        const realIp = c.req.header("x-real-ip");
        return forwardedFor ?? realIp ?? "unknown";
    },
});
