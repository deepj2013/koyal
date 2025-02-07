import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    token: String,
    expiresAt: Number
}, { timestamps: true });

const Token = mongoose.model('tokens', TokenSchema)

export default Token