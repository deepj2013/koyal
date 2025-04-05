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
        ref: 'users'
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
}, { timestamps: true }
);

const userTaskLog = mongoose.model('userTaskLogs', userTaskLogSchema);

export default userTaskLog;