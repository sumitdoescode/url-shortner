import { Visit } from "../models/visit.model";
import { Url } from "../models/url.model";
import { Context } from "hono";
import { redis } from "../lib/redis";

export const handleRedirect = async (c: Context) => {
    try {
        const { shortCode } = c.req.param();
        if (!shortCode || !shortCode.trim() || shortCode.length !== 5) {
            return c.json({ ok: false, error: "Invalid short code" }, 400);
        }
        const cacheKey = `url:${shortCode}`;

        const cachedRedirect = await redis.get(cacheKey);
        if (!cachedRedirect) {
            const url = await Url.findOne({ shortCode });
            if (!url) {
                return c.json({ ok: false, error: "URL not found" }, 404);
            }
            await redis.setEx(
                cacheKey,
                60 * 60 * 24 * 7, // 1 week
                JSON.stringify({
                    id: url._id.toString(),
                    originalUrl: url.originalUrl,
                }),
            );
        }

        const { id, originalUrl } = JSON.parse(cachedRedirect!);

        Visit.create({
            urlId: id,
        }).catch((error) => {
            console.error("VISIT CREATE ERROR:", { error });
        });
        return c.redirect(originalUrl);
    } catch (error) {
        console.error("REDIRECT ERROR:", { error });
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};
