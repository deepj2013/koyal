import mongoose from "mongoose";
import { OrientationEnum, taskLogStatusENUM, taskStatusENUM, userTaskLogNameEnum, visualStyleEnum } from "../enums/ENUMS.js";

const userTaskLogSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true,
        ref: 'userTasks',
        index: true
    },
    userId: {
        type: String,
        required: true,
        ref: 'users',
        index: true
    },
    taskName: {
        type: String,
        enum: Object.values(userTaskLogNameEnum),
        required: true
    },
    isAudioUpload: {
        type: Boolean,
        default: false
    },
    audioUrl: {
        type: String
    },
    audioPath: {
        type: String
    },
    audioJSON: {
        type: String
    },
    groupId: {
        type: String,
        required: true,
        index: true
    },
    audioDetails: {
        originalFileName: { type: String },
        collectionName: { type: String },
        theme: { type: String },
        style: {
            type: String,
            enum: Object.values(visualStyleEnum),
            default: visualStyleEnum.SKETCH
        },
        orientation: {
            type: String,
            enum: Object.values(OrientationEnum),
            default: OrientationEnum.PORTRAIT
        },
        character: { type: String }
    },
    audioMetadata: {
        originalName: { type: String },
        mimeType: { type: String },
        size: { type: Number },
        encoding: { type: String },
        uploadTime: {
            type: Date,
            default: Date.now()
        },
        duration: { type: Number },
    },
    status: {
        type: String,
        enum: Object.values(taskLogStatusENUM),
        required: true,
        default: taskLogStatusENUM.PROGRESS,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true }
);

userTaskLogSchema.index({ createdAt: -1 })
const userTaskLog = mongoose.model('userTaskLogs', userTaskLogSchema);

export default userTaskLog;