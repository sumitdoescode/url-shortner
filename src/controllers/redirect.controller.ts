import { Visit } from "../models/visit.model";
import { Url } from "../models/url.model";
import { Context } from "hono";

export const handleRedirect = async (c: Context) => {
    try {
        const { shortCode } = c.req.param();
        if (!shortCode || !shortCode.trim() || shortCode.length !== 5) {
            return c.json({ ok: false, error: "Invalid short code" }, 400);
        }
        const url = await Url.findOne({ shortCode });
        if (!url) {
            return c.json({ ok: false, error: "URL not found" }, 404);
        }
        await Visit.create({
            urlId: url._id,
        });
        return c.redirect(url.originalUrl);
    } catch (error) {
        console.error("REDIRECT ERROR :", error);
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};
