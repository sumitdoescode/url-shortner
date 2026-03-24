import { Hono } from "hono";
import mongoose from "mongoose";
import { redis } from "../lib/redis";

const router = new Hono();

// GET => /api/health
router.get("/", (c) => {
    return c.json({
        ok: true,
        server: "healthy",
        uptimeSeconds: Number(process.uptime().toFixed(2)),
        services: {
            database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
            redis: redis.isReady ? "connected" : "disconnected",
        },
    });
});

export default router;
