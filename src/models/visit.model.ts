import { Schema, model } from "mongoose";

const visitSchema = new Schema(
    {
        urlId: {
            type: Schema.Types.ObjectId,
            ref: "Url",
            required: true,
        },
    },
    { timestamps: true },
);

// doens't matter as if we are doing more create operation than read operation, every redirect will add it's entry in this collection
// visitSchema.index({ urlId: 1 });

export const Visit = model("Visit", visitSchema);
