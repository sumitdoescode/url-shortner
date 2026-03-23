import { Hono } from "hono";
import { handleRedirect } from "../controllers/redirect.controller";
import { redirectRateLimit } from "../middlewares/rate-limit.middleware";

const router = new Hono();

router.get("/:shortCode", redirectRateLimit, handleRedirect); // GET => /r/:shortCode

export default router;
