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
    isActive:{
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'users'
    // },
    // updatedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'users'
    // }
}, { timestamps: true });

const User = mongoose.model('users', UserSchema)

export default User