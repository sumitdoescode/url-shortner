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

        let url: any;
        if (!cachedRedirect) {
            // if cache doesn't exists we need to check in the database
            url = await Url.findOne({ shortCode }).select("-__v -updatedAt -userId");
            if (!url) {
                return c.json({ ok: false, error: "URL not found" }, 404);
            }
            // store it in cache for 1 week
            await redis.setEx(
                cacheKey,
                60 * 60 * 24 * 7, // 1 week
                JSON.stringify({
                    id: url._id.toString(),
                    originalUrl: url.originalUrl,
                }),
            );
        } else {
            url = JSON.parse(cachedRedirect);
        }

        Visit.create({
            urlId: url.id,
        }).catch((error) => {
            console.error("VISIT CREATE ERROR:", { error });
        });
        return c.redirect(url.originalUrl);
    } catch (error) {
        console.error("REDIRECT ERROR:", { error });
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};
