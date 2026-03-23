import type { Context, Next } from "hono";
import { auth } from "../lib/auth";

export const requireAuth = async (c: Context, next: Next) => {
    try {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers,
        });
        if (!session) {
            return c.json({ ok: false, error: "Unauthorized" }, 401);
        }
        c.set("user", session.user);
        await next();
    } catch (error) {
        console.error("AUTH MIDDLEWARE ERROR :", error);
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};
