import { Schema, model } from "mongoose";

// it will be used to store user profile data which is related to application
const profileSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free",
        },
    },
    { timestamps: true },
);

export const Profile = model("Profile", profileSchema);
