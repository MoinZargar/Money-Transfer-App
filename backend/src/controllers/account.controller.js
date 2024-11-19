import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { Account } from "../models/account.model.js";
import mongoose from "mongoose";


const getBalance = asyncHandler(async (req, res) => {
    const account = await Account.findOne({ user: req.user._id });
    if (!account) {
        throw new apiError(404, "Account not found");
    }
    res.status(200).json(new apiResponse(200, { balance: account.balance }));
});

const transferMoney = asyncHandler(async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        const { amount, to } = req.body;
        const account = await Account.findOne({ user: req.user._id }).session(session);
        if (!account) {
            await session.abortTransaction();
            throw new apiError(404, "Account not found");
        }
        if (account.balance < amount) {
            throw new apiError(400, "Insufficient balance");
        }
        const toAccount = await Account.findOne({ user: to }).session(session);
        if (!toAccount) {
            throw new apiError(404, "Receiver account not found");
        }
        // Perform the transfer
        await Account.updateOne({ user: req.user?._id }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ user: to }, { $inc: { balance: amount } }).session(session);
        // Commit the transaction
        await session.commitTransaction();
        res.status(200).json(new apiResponse(200, { message: "Transfer successful" }));
    } catch (error) {
        if (session) await session.abortTransaction();
        throw new apiError(error.statusCode || 500 ,error.message || "Internal server error");
    } finally {
        if (session) session.endSession();
    }
})
export {
    getBalance,
    transferMoney,
}