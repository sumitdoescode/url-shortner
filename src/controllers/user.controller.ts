import type { Context } from "hono";
import { auth } from "../lib/auth";
import { flattenError } from "zod";
import { signupSchema, signinSchema } from "../schemas/user.schema";
import { Profile } from "../models/profile.model";

export const signup = async (c: Context) => {
    try {
        const data = await c.req.json();
        const result = signupSchema.safeParse(data);
        if (!result.success) {
            return c.json({ ok: false, error: flattenError(result.error).fieldErrors }, 400);
        }
        const { name, email, password } = result.data;
        try {
            const response = await auth.api.signUpEmail({
                body: {
                    name,
                    email,
                    password,
                    // callbackURL: "https://example.com/callback",
                },
                headers: c.req.raw.headers,
            });

            await Profile.create({
                userId: response.user.id,
                plan: "free",
            });

            return c.json({ ok: true, message: "User created successfully. Please verify your email." }, 201);
        } catch (error) {
            return c.json({ ok: false, error: error instanceof Error ? error.message : "Unable to signup user" }, 400);
        }
    } catch (error) {
        console.error("USER SIGNUP ERROR:", { error });
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};

export const signin = async (c: Context) => {
    try {
        const data = await c.req.json();
        const result = signinSchema.safeParse(data);
        if (!result.success) {
            return c.json({ ok: false, error: flattenError(result.error).fieldErrors }, 400);
        }
        const { email, password } = result.data;
        try {
            return await auth.api.signInEmail({
                body: {
                    email,
                    password,
                    rememberMe: true,
                    // callbackURL : "something here"
                },
                headers: c.req.raw.headers,
                asResponse: true,
            });
        } catch (error) {
            return c.json({ ok: false, error: error instanceof Error ? error.message : "Invalid credentials" }, 401);
        }
    } catch (error) {
        console.error("USER SIGNIN ERROR:", { error });
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};

export const logout = async (c: Context) => {
    try {
        return await auth.api.signOut({
            headers: c.req.raw.headers,
            asResponse: true,
        });
    } catch (error) {
        console.error("USER LOGOUT ERROR:", { error });
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};

export const getMe = async (c: Context) => {
    try {
        const user = c.get("user");
        return c.json({ ok: true, user });
    } catch (error) {
        console.error("USER FETCHING ERROR:", { userId: c.get("user")?.id, error });
        return c.json({ ok: false, error: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};
