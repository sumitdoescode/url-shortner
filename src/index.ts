import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { setCookie, getCookie } from "hono/cookie";
import { sign, verify } from "jsonwebtoken";

const app = new Hono();
console.log(process.env.JWT_SECRET);
app.use(logger());

app.use(
    cors({
        origin: [`${process.env.FRONTEND_URL}`],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }),
);

app.get("/", (c) => {
    return c.json({ ok: true, message: "Welcome !" });
});

app.post("/login", async (c) => {
    const body = await c.req.json();
    console.log(body);
    const token = sign(body, process.env.JWT_SECRET!, {
        expiresIn: "24h",
    });
    setCookie(c, "token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60,
    });
    return c.json({ ok: true, message: "Successfully logged in" });
});

app.get("/dashboard", (c) => {
    console.log("coming here");
    const cookie = getCookie(c, "token");
    if (!cookie) {
        return c.json({ ok: false, message: "Unauthorized" });
    }
    let decoded;
    try {
        decoded = verify(cookie, process.env.JWT_SECRET!);
    } catch (error) {
        return c.json({ ok: false, message: "Invalid token or expired" });
    }
    console.log(decoded);
    return c.json({ ok: true, message: "Dashboard page", user: decoded });
});

export default app;
