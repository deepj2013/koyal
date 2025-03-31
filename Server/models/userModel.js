import mongoose from "mongoose";
import { roleEnum } from "../enums/ENUMS.js";

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        require: true,
        type: String,
        unique: true,
    },
    otp: {
        type: Number,
        unique: true,
    },
    password: {
        require:true,
        type: String,
        match: [
            /^(?=.*[A-Za-z]{4,})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
            'Password must contain at least 4 letters, one number and one special character'
        ]
    },
    role: {
        type: String,
        enum: roleEnum,
        default: roleEnum.USER
    },
    optExpiry: {
        type: Date,
        default: Date.now() + 10 * 60 * 1000,
    },
}, { timestamps: true });

const User = mongoose.model('users', UserSchema)

export default User