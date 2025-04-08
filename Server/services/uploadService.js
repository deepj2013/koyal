import APIError, { HttpStatusCode } from "../exception/errorHandler.js";
import { uploadSongsToS3 } from "./s3Service.js";
import userTaskLog from "../models/userTaskLogModel.js";
import logger from "../utils/logger.js";
import userTask from "../models/userTaskModel.js";
import { taskLogStatusENUM, taskTypeEnum, userTaskLogNameEnum } from "../enums/ENUMS.js";

export const bulkAudioUploadService = async (audioFiles, user) => {
    try {
        const email = user.email;
        if (!audioFiles?.length) {
            throw new APIError(
                "No audio files found",
                HttpStatusCode.BAD_REQUEST,
                true,
                "No audio files found"
            );
        }
        const { code, files } = await uploadSongsToS3(audioFiles, email);

        if (code !== 200) {
            throw new APIError(
                "something went wrong while uploading songs",
                HttpStatusCode.BAD_REQUEST,
                true,
                "plese try again later"
            );
        }
        const groupId = `group-${Date.now()}`;
        let taskDetails = await userTask.findOne({ userId: user._id, groupId: groupId });
        if (!taskDetails) {
            taskDetails = await userTask.create({
                userId: user._id,
                taskLogIds: [],
                groupId: groupId,
                numberofTaskLog: audioFiles.length,
                taskType: taskTypeEnum.GROUP,
                stage: 1,
            })
        }
        const taskId = taskDetails?._id;

        const taskLogs = await Promise.all(files.map(async (file, index) => {
            const { url, fileName } = file;
            const fileExtension = fileName.split('.').pop();
            const taskLog = new userTaskLog({
                taskId: taskId,
                userId: user._id,
                taskName: userTaskLogNameEnum.UPLOAD_AUDIO,
                audioDetails: {
                    originalFileName: fileName,
                },
                groupId: groupId,
                isAudioUpload: true,
                audioUrl: url,
                audioPath: `${email}/collections/${fileName}`,
                status: taskLogStatusENUM.COMPLETED,
                audioMetadata: {
                    originalName: fileName,
                    mimeType: fileExtension,
                }
            });
            await taskLog.save();
            return {
                _id: taskLog._id,
                taskId: taskLog.taskId,
                taskType: taskLog.taskName,
                url: taskLog.audioUrl,
                path: taskLog.audioPath,
                groupId: taskLog.groupId,
            };
        }));
        const taskLogIds = taskLogs.map(log => log._id);
        taskDetails.taskLogIds.push(...taskLogIds);
        await taskDetails.save();
        // const taskLogIds = taskLogs.map(log => log._id);
        // if (createdUserTask) {
        //     createdUserTask.taskLogIds = taskLogIds;
        //     await createdUserTask.save();
        // } else {
        //     taskDetails.taskLogIds.push(...taskLogIds);
        //     await taskDetails.save();
        // }
        return taskLogs;

    } catch (error) {
        logger.error('Bulk upload error:', error);
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message,
        );
    }
}
