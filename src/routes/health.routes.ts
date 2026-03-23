import { Hono } from "hono";

const router = new Hono();

router.get("/health", (c) => {
    return c.json({ ok: true, message: "Welcome !" });
});

export default router;
