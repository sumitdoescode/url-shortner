import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { connectDB } from "./lib/db";
import { connectRedis } from "./lib/redis";
import { setServers } from "node:dns";
import { auth } from "./lib/auth";
import userRoutes from "./routes/user.routes";
import urlRoutes from "./routes/url.routes";
import redirectRoutes from "./routes/redirect.routes";
import healthRoutes from "./routes/health.routes";

setServers(["1.1.1.1", "1.0.0.1"]);

const app = new Hono();

app.use(logger());

app.use(
    cors({
        origin: "*",
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

app.route("/r", redirectRoutes);
app.route("/api/users", userRoutes);
app.route("/api/urls", urlRoutes);
app.route("/api/health", healthRoutes);

app.notFound((c) => {
    return c.json({ message: "Route not found" }, 404);
});

app.onError((err, c) => {
    console.error("UNHANDLED APP ERROR:", err);
    return c.json({ message: "Something went wrong" }, 500);
});

connectDB();
connectRedis();
export default app;
