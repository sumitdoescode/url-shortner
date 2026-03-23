import { model, Schema } from "mongoose";

const urlSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        originalUrl: {
            type: String,
            required: true,
            trim: true,
        },
        shortCode: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

urlSchema.index({ userId: 1 });
urlSchema.index({ shortCode: 1 }, { unique: true });

export const Url = model("Url", urlSchema);
