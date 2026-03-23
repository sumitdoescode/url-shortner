import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const adapter = mongodbAdapter(client.db("url-shortner"));

export const auth = betterAuth({
    database: adapter,
    emailAndPassword: {
        enabled: true,
    },
    // emailVerification: {
    //     enabled: true,
    // },

    //...
});
