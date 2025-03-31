import mongoose from "mongoose";
import { roleEnum } from "../enums/ENUMS.js";

const UserSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim:true
    },
    email: {
        required: true,
        type: String,
        unique: true,
        trim: true
    },
    password: {
        require: true,
        type: String,
        minLength: 6,
    },
    role: {
        type: String,
        enum: roleEnum,
        default: roleEnum.USER
    },
}, { timestamps: true });

const User = mongoose.model('users', UserSchema)

export default User