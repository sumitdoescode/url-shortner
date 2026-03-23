import type { Context } from "hono";
import { createUrlSchema } from "../schemas/url.schema";
import { flattenError } from "zod";
import { Url } from "../models/url.model";
import { Visit } from "../models/visit.model";
import { Profile } from "../models/profile.model";
import { nanoid } from "nanoid";
import { isValidObjectId } from "mongoose";

export const createUrl = async (c: Context) => {
    try {
        const user = c.get("user");
        const body = await c.req.json();
        const result = createUrlSchema.safeParse(body);
        if (!result.success) {
            return c.json({ ok: false, error: flattenError(result.error).fieldErrors }, 400);
        }
        const { url } = result.data;
        const profile = await Profile.findOne({ userId: user.id });

        if (!profile) {
            return c.json({ ok: false, error: "Profile not found" }, 404);
        }

        const urlLimit = profile.plan === "pro" ? 100 : 5;
        const usedUrls = await Url.countDocuments({ userId: user.id });

        if (usedUrls >= urlLimit) {
            return c.json({ ok: false, error: "URL limit reached, please upgrade to pro plan" }, 403);
        }

        let createdUrl;

        try {
            createdUrl = await Url.create({
                userId: user.id,
                originalUrl: url,
                shortCode: nanoid(5),
            });
        } catch (error: any) {
            if (error?.code !== 11000) throw error; // field duplication error (shortcode is duplicate)

            createdUrl = await Url.create({
                userId: user.id,
                originalUrl: url,
                shortCode: nanoid(5),
            });
        }

        return c.json({ ok: true, createdUrl }, 201);
    } catch (error) {
        console.error("URL CREATION ERROR :", error);
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};

export const getAllUrls = async (c: Context) => {
    try {
        const user = c.get("user");
        const urls = await Url.find({ userId: user.id }).sort({ createdAt: -1 }).select("-__v -updatedAt -userId");
        return c.json({ ok: true, urls });
    } catch (error) {
        console.error("URLS FETCHING ERROR :", error);
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};

export const getSingleUrl = async (c: Context) => {
    try {
        const user = c.get("user");
        const { id } = c.req.param();
        if (!isValidObjectId(id)) {
            return c.json({ ok: false, error: "Invalid URL ID" }, 400);
        }
        let url: any = await Url.findOne({ _id: id, userId: user.id }).select("-__v -updatedAt -userId");
        if (!url) {
            return c.json({ ok: false, error: "URL not found" }, 404);
        }

        const totalVisits = await Visit.countDocuments({ urlId: id });
        url = { ...url._doc, totalVisits, shortUrl: `${process.env.BASE_URL}/r/${url.shortCode}` };
        return c.json({ ok: true, url });
    } catch (error) {
        console.error("URL FETCHING ERROR :", error);
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};

export const deleteUrl = async (c: Context) => {
    try {
        const user = c.get("user");
        const { id } = c.req.param();
        if (!isValidObjectId(id)) {
            return c.json({ ok: false, error: "Invalid URL ID" }, 400);
        }
        const deleted = await Url.findOneAndDelete({ _id: id, userId: user.id });
        if (!deleted) {
            return c.json({ ok: false, error: "URL not found or you are not authorized to delete it" }, 404);
        }
        return c.json({ ok: true, message: "URL deleted successfully" });
    } catch (error) {
        console.error("URL DELETION ERROR :", error);
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};

export const getUrlVisits = async (c: Context) => {
    try {
        const user = c.get("user");
        const { id } = c.req.param();
        if (!isValidObjectId(id)) {
            return c.json({ ok: false, error: "Invalid URL ID" }, 400);
        }
        const url = await Url.findOne({ _id: id, userId: user.id });
        if (!url) {
            return c.json({ ok: false, error: "URL not found" }, 404);
        }

        const visits = await Visit.find({ urlId: id }).sort({ createdAt: -1 });
        return c.json({ ok: true, visits });
    } catch (error) {
        console.error("URL FETCHING ERROR :", error);
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};
