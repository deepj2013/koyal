import APIError, { HttpStatusCode } from "../exception/errorHandler.js";
import { uploadSingleSongToS3, uploadSongsToS3 } from "./s3Service.js";
import userTaskLog from "../models/userTaskLogModel.js";
import logger from "../utils/logger.js";
import userTask from "../models/userTaskModel.js";
import { taskTypeEnum } from "../enums/ENUMS.js";
import { createAudioExcel } from "../utils/xlsxToJson.js";
import userAudio from "../models/userAudioModel.js";
import { v4 as uuidv4 } from 'uuid';
import { toStringId } from "../utils/mongo.js";

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
        const groupId = `group-${uuidv4()}`;
        const audioLogDocs = files.map(file => {
            const { url, fileName } = file;
            const fileExtension = fileName.split('.').pop();
            return {
                userId: user._id,
                groupId,
                audioUrl: url,
                fileName,
                mimeType: fileExtension,
                audioPath: `${email}/collections/${fileName}`,
            };
        });

        const savedAudioLogs = await userAudio.insertMany(audioLogDocs);
        const audioIds = savedAudioLogs.map(log => log._id);

        const taskDetails = await userTask.create({
            userId: user._id,
            groupId,
            audioIds,
            numberofTaskLog: audioIds.length,
            taskType: taskTypeEnum.GROUP,
            stage: 1,
        })
        return savedAudioLogs.map(log => ({
            _id: log._id,
            url: log.audioUrl,
            path: log.audioPath,
            groupId: log.groupId,
            fileName: log.fileName,
            taskId: taskDetails._id,
        }));
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
                    userId: toStringId(_id),
                    groupId: groupId,
                    isDeleted: false
                }
            },
            {
                $project: {
                    _id: 1,
                    fileName: 1,
                    audioUrl: 1,
                    audioPath: 1,
                }
            }
        ];

        const audioLogs = await userAudio.aggregate(aggr);

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
export const singleAudioUploadService = async (audioFile, user) => {
    try {
        const email = user.email;

        if (!audioFile) {
            throw new APIError(
                "No audio file found",
                HttpStatusCode.BAD_REQUEST,
                true,
                "Audio file is required"
            );
        }

        const { code, file } = await uploadSingleSongToS3(audioFile, email);

        if (code !== 200 || !file) {
            throw new APIError(
                "Error uploading the audio file",
                HttpStatusCode.BAD_REQUEST,
                true,
                "Please try again later"
            );
        }

        const { url, fileName } = file;
        const fileExtension = fileName.split('.').pop();
        const groupId = `single-${uuidv4()}`;

        const savedAudioLog = await userAudio.create({
            userId: toStringId(user._id),
            groupId,
            audioUrl: url,
            fileName,
            mimeType: fileExtension,
            audioPath: `${email}/${fileName}`,
        });

        const taskDetails = await userTask.create({
            userId: toStringId(user._id),
            groupId,
            audioIds: [savedAudioLog._id],
            numberofTaskLog: 1,
            taskType: taskTypeEnum.INDIVIDUAL,
            stage: 1,
            isAudioUpload: true
        });

        return {
            // _id: savedAudioLog._id,
            url: savedAudioLog.audioUrl,
            path: savedAudioLog.audioPath,
            groupId: savedAudioLog.groupId,
            fileName: savedAudioLog.fileName,
            taskId: taskDetails._id,
        };
    } catch (error) {
        logger.error('Single audio upload error:', error);
        throw new APIError(
            error.name || "UploadError",
            error.httpCode || HttpStatusCode.INTERNAL_SERVER,
            error.isOperational ?? false,
            error.message || "Something went wrong"
        );
    }
}