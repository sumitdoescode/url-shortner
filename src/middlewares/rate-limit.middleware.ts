import { rateLimiter } from "hono-rate-limiter";

export const authRateLimit = rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 10, // limit each IP to 10 requests per windowMs
    keyGenerator: (c) => {
        const forwardedFor = c.req.header("x-forwarded-for");
        const realIp = c.req.header("x-real-ip");
        return forwardedFor ?? realIp ?? "unknown";
    },
});

export const redirectRateLimit = rateLimiter({
    windowMs: 60 * 1000, // 1 minute
    limit: 60, // limit each IP to 60 requests per windowMs
    keyGenerator: (c) => {
        const forwardedFor = c.req.header("x-forwarded-for");
        const realIp = c.req.header("x-real-ip");
        return forwardedFor ?? realIp ?? "unknown";
    },
});
