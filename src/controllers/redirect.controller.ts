import { Visit } from "../models/visit.model";
import { Url } from "../models/url.model";
import { Context } from "hono";
import { redis } from "../lib/redis";

type CachedRedirect = {
    id: string;
    originalUrl: string;
};

export const handleRedirect = async (c: Context) => {
    try {
        const { shortCode } = c.req.param();
        if (!shortCode || !shortCode.trim() || shortCode.length !== 5) {
            return c.json({ ok: false, error: "Invalid short code" }, 400);
        }
        const cacheKey = `url:${shortCode}`;

        const cachedRedirect = await redis.get(cacheKey);
        if (cachedRedirect) {
            const { id, originalUrl } = JSON.parse(cachedRedirect) as CachedRedirect;

            Visit.create({
                urlId: id,
            }).catch((error) => {
                console.error("VISIT CREATE ERROR:", { error });
            });
            return c.redirect(originalUrl);
        }

        const url = await Url.findOne({ shortCode });
        if (!url) {
            return c.json({ ok: false, error: "URL not found" }, 404);
        }

        await redis.setEx(
            cacheKey,
            60 * 60 * 24, // 1 day
            JSON.stringify({
                id: url._id.toString(),
                originalUrl: url.originalUrl,
            } satisfies CachedRedirect),
        );

        Visit.create({
            urlId: url._id,
        }).catch((error) => {
            console.error("VISIT CREATE ERROR:", { error });
        });
        return c.redirect(url.originalUrl);
    } catch (error) {
        console.error("REDIRECT ERROR:", { error });
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};
