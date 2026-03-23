import { Hono } from "hono";
import { signup, signin, logout, getMe } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { authRateLimit } from "../middlewares/rate-limit.middleware";

const router = new Hono();

router.post("/signup", authRateLimit, signup); // POST => /api/users/signup
router.post("/signin", authRateLimit, signin); // POST => /api/users/signin
router.post("/logout", requireAuth, logout); // POST => /api/users/logout
router.get("/me", requireAuth, getMe); // GET => /api/users/me

export default router;
