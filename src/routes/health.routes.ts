import { Hono } from "hono";
import mongoose from "mongoose";

const router = new Hono();

// GET => /api/health
router.get("/", (c) => {
    return c.json({
        ok: true,
        server: "healthy",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});

export default router;
