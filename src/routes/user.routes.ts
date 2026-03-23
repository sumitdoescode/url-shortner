import { Hono } from "hono";
import { signup, signin } from "../controllers/user.controller";

const router = new Hono();

// POST => /api/users/signup
router.post("/signup", signup);

// POST => /api/users/signin
router.post("/signin", signin);

export default router;
