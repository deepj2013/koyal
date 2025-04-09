import APIError, { HttpStatusCode } from "../exception/errorHandler.js";
import { uploadSongsToS3 } from "./s3Service.js";
import userTaskLog from "../models/userTaskLogModel.js";
import logger from "../utils/logger.js";
import userTask from "../models/userTaskModel.js";
import { taskLogStatusENUM, taskTypeEnum, userTaskLogNameEnum } from "../enums/ENUMS.js";
import { createAudioExcel } from "../utils/xlsxToJson.js";

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
export const downloadAudioExcelService = async (requestUser, queryData) => {
    try {
        const { _id } = requestUser;
        const { groupId, taskId } = queryData;
        if (!groupId || !taskId) {
            throw new APIError(
                "groupId,taskId is required",
                HttpStatusCode.BAD_REQUEST,
                true,
                "groupId,taskId is not found"
            );
        }
        const aggr = [
            {
                $match: {
                    userId: _id.toString(),
                    groupId: groupId,
                    taskId: taskId,
                    isAudioUpload: true,
                    isDeleted: false
                }
            },
            {
                $project: {
                    _id: 1,
                    "audioDetails.originalFileName": 1,
                    "audioDetails.collectionName": 1,
                    "audioDetails.theme": 1,
                    "audioDetails.character": 1,
                    "audioDetails.style": 1,
                    "audioDetails.orientation": 1
                }
            }
        ];

        const audioLogs = await userTaskLog.aggregate(aggr);

        console.log("audioLogs", audioLogs);
        

        if (!audioLogs.length) {
            throw new APIError(
                "No audio files found",
                HttpStatusCode.NOT_FOUND,
                true,
                "No audio files found for the given group and task"
            );
        }

        const result = await createAudioExcel(audioLogs);

        if (!result.success) {
            logger.error("ERROR in creating audio excel", result.message);
            throw new APIError(
                "Something went wrong while creating the Excel file",
                HttpStatusCode.NOT_FOUND,
                true,
                result.message
            );
        }

        return result.data; 
    } catch (error) {
        logger.error("ERROR in downloading audio excel", error);
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        );
    }
}