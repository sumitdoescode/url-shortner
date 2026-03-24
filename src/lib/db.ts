import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please provide MONGODB_URI in the environment variables");
}

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(MONGODB_URI, {
            dbName: "url-shortner",
        });
        console.log("MONGODB CONNECTED:", connection.host);
    } catch (error) {
        console.error("MONGODB CONNECTION ERROR:", error);
    }
};
