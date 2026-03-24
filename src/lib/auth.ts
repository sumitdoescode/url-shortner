import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { resend } from "./resend";

const client = new MongoClient(process.env.MONGODB_URI!);
const adapter = mongodbAdapter(client.db("url-shortner"));

export const auth = betterAuth({
    database: adapter,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        sendVerificationEmail: async ({ user, url, token }) => {
            const { data, error } = await resend.emails.send({
                from: `onboarding@resend.dev`,
                to: user.email,
                subject: "Verify your email address",
                html: `
                <h1>Verify your email address</h1>
                <p>Click on the link below to verify your email address</p>
                <a href="${url}">Verify your email address</a>
                `,
                // react: EmailVerificationTemplate({ name: user.name, email: user.email, verificationUrl: url }),
            });
            if (error) {
                console.error("EMAIL VERIFICATION SEND ERROR:", {
                    userId: user.id,
                    email: user.email,
                    error,
                });
            }
        },
    },
    // emailVerification: {
    //     enabled: true,
    // },

    //...
});
