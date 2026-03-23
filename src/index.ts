import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { connectDB } from "./lib/db";
import { setServers } from "node:dns";
import userRoutes from "./routes/user.routes";
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

app.route("/api/user", userRoutes);
app.route("/api/health", healthRoutes);

app.notFound((c) => {
    return c.json({ message: "Route not found" }, 404);
});

app.onError((err, c) => {
    console.error(`${err}`);
    return c.json({ message: "Something went wrong" }, 500);
});

connectDB();
export default app;
