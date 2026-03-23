import { User } from "../models/user.model";
import type { Context } from "hono";

export const signup = async (c: Context) => {
    try {
        const { name, email, password } = await c.req.json();
        console.log({ name, email, password });
        return c.json({ ok: true, message: "User created successfully" });
    } catch (error) {
        console.error("USER SIGNUP ERROR :", error);
        return c.json({ ok: false, message: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};

export const signin = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();
        console.log({ email, password });
        return c.json({ ok: true, message: "User signed in successfully" });
    } catch (error) {
        console.error("USER SIGNIN ERROR :", error);
        return c.json({ ok: false, message: error instanceof Error ? error.message : "Internal Server Error" }, 500);
    }
};
