import mongoose from 'mongoose';
import { taskTypeEnum, taskStatusENUM } from '../enums/ENUMS.js';

const userTaskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    audioIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userAudios'
    }],
    taskLogIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userTaskLogs'
    }],
    groupId: {
        type: String,
        required: true,
        index: true
    },
    numberofTaskLog: {
        type: Number,
        default: 0
    },
    taskType: {
        type: String,
        enum: Object.values(taskTypeEnum),
        default: taskTypeEnum.INDIVIDUAL
    },
    isAudioUpload: {
        type: Boolean,
        default: false
    },
    collectionName: {
        type: String
    },
    stage: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(taskStatusENUM),
        default: taskStatusENUM.PENDING
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
},
    { timestamps: true }
);

userTaskSchema.index({ createdAt: 1 });
userTaskSchema.index({ userId: 1, createdAt: -1 });
const userTask = mongoose.model('userTasks', userTaskSchema);

export default userTask;
