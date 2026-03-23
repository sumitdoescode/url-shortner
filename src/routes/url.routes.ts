import { Hono } from "hono";
import { requireAuth } from "../middlewares/auth.middleware";
import { createUrl, deleteUrl, getAllUrls, getSingleUrl, getUrlVisits } from "../controllers/url.controller";

const router = new Hono();

router.post("/", requireAuth, createUrl); // POST => /api/urls/
router.get("/", requireAuth, getAllUrls); // GET => /api/urls/
router.get("/:id/visits", requireAuth, getUrlVisits); // GET => /api/urls/:id/visits
router.get("/:id", requireAuth, getSingleUrl); // GET => /api/urls/:id
router.delete("/:id", requireAuth, deleteUrl); // DELETE => /api/urls/:id

export default router;
