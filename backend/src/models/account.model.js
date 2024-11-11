import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        balance: {
            type: Number,
            required: true,
            default: 0
        },
    },
    {
        timestamps: true
    }
)

export const Account = mongoose.model("Account", accountSchema)