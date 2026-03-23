import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: "user",
        strict: false,
        versionKey: false,
        timestamps: true,
    },
);

export const User = model("User", userSchema);
