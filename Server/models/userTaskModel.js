import mongoose from 'mongoose';
import { taskTypeEnum, taskStatusENUM, OrientationEnum, visualStyleEnum } from '../enums/ENUMS.js';

const userTaskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    taskLogIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userTaskLogs'
    }],
    numberofTaskLog: {
        type: Number,
        default: 0
    },
    taskDetails: {
        collectionName: { type: String },
        theme: { type: String },
        character: { type: String },
        style: {
            type: String,
            enum: Object.values(visualStyleEnum),
        },
        orientation: {
            type: String,
            enum: Object.values(OrientationEnum),
        }
    },
    taskType: {
        type: String,
        enum: Object.values(taskTypeEnum),
        default: taskTypeEnum.INDIVIDUAL
    },
    stage: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(taskStatusENUM),
        default: taskStatusENUM.PENDING
    }
},
    { timestamps: true }
);
const userTask = mongoose.model('userTasks', userTaskSchema);

export default userTask;
