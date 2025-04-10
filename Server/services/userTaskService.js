import { request } from "express";
import { taskTypeEnum, userStageEnum } from "../enums/ENUMS.js";
import APIError, { HttpStatusCode } from "../exception/errorHandler.js";
import userTask from "../models/userTaskModel.js";
import logger from "../utils/logger.js";
import { validateAudioDetail, validateCollectionDetails, validateExcelRequest, validateQuery } from "../validations/user/userTaskValidation.js";
import { toObjectId, toStringId } from "../utils/mongo.js";
import userAudio from "../models/userAudioModel.js";
import userTaskLog from "../models/userTaskLogModel.js";

export const bulkAudioDetailsService = async (requestData, requestFile, queryData, requestUser) => {
    try {
        const isExcelUpload = parseInt(queryData.isExcelUpload);
        const { error: queryError } = validateQuery({ isExcelUpload });
        if (queryError) {
            throw new APIError(
                "BAD_INPUT",
                HttpStatusCode.BAD_REQUEST,
                true,
                queryError.details[0].message
            );
        }
        if (isExcelUpload === 1) {
            const { groupId, taskId, filesData } = requestData;
            const { error: dataError } = validateExcelRequest(requestData);
            if (dataError) {
                throw new APIError(
                    "Validation Error",
                    HttpStatusCode.BAD_REQUEST,
                    true,
                    dataError.details[0].message
                );
            }
            const { _id } = requestUser;
            const userIdStr = toStringId(_id);
            const userTaskPromises = filesData.map(async (file) => {
                const { fileName, theme, character, style, orientation, lipSync, collectionName } = file;
                const audioDetails = await userAudio.find({
                    userId: userIdStr,
                    groupId,
                    fileName: fileName
                });
                console.log("audioDetails", audioDetails);

                if (!audioDetails || audioDetails.length === 0) {
                    console.warn(`Audio not found for filename: ${fileName}`);
                    return [];
                }

                const tasks = audioDetails.map(audio => ({
                    userId: userIdStr,
                    taskId: taskId,
                    taskName: userStageEnum.UPLOAD_AUDIO,
                    groupId,
                    audioDetails: {
                        audioId: audio._id,
                        audioUrl: audio.audioUrl,
                        originalFileName: fileName,
                        collectionName: collectionName || 'N/A',
                        theme,
                        character,
                        style,
                        orientation,
                        lipSync
                    }
                }));
                return tasks;
            });
            console.log("userTaskPromises", userTaskPromises);

            const allTaskLogsArrays = await Promise.all(userTaskPromises);

            const userTaskLogs = allTaskLogsArrays.flat();

            if (userTaskLogs.length === 0) {
                throw new APIError(
                    "No valid audio files found.",
                    HttpStatusCode.BAD_REQUEST,
                    true,
                    "No matching audio data found for given filenames"
                );
            }

            const createdTask = await userTaskLog.insertMany(userTaskLogs);
            const createdTaskIds = createdTask.map(task => task._id);
            await userTask.findOneAndUpdate(
                { _id: toObjectId(taskId), userId: userIdStr, groupId: groupId },
                { $push: { taskLogIds: { $each: createdTaskIds } } },
                { new: true }
            );
            return createdTask;

        } else if (isExcelUpload === 0) {
            const { error: dataError } = validateCollectionDetails(requestData);
            if (dataError) {
                throw new APIError(
                    "Validation Error",
                    HttpStatusCode.BAD_REQUEST,
                    true,
                    dataError.details[0].message
                );
            }
            const { groupId, taskId, collectionName, theme, character, style, orientation, lipSync } = requestData;
            const { _id } = requestUser;
            const audioDetails = await userAudio.find({
                userId: toStringId(_id),
                groupId: groupId,
            })
            if (!audioDetails || audioDetails.length === 0) {
                throw new APIError(
                    "Audio not found",
                    HttpStatusCode.BAD_REQUEST,
                    true,
                    "Audio not found for this user"
                );
            }
            const userTask = [];
            for (let audio of audioDetails) {
                const createdInstance = new userTaskLog({
                    userId: toStringId(_id),
                    taskId: taskId,
                    taskName: userStageEnum.UPLOAD_AUDIO,
                    groupId: groupId,
                    audioDetails: {
                        audioId: audio._id,
                        audioUrl: audio.audioUrl,
                        originalFileName: audio.originalFileName,
                        collectionName: collectionName,
                        theme: theme,
                        character: character,
                        style: style,
                        orientation: orientation,
                        lipSync: lipSync
                    },
                })
                userTask.push(createdInstance);
            }
            const createdTask = await userTaskLog.insertMany(userTask)
            console.log("Created TAsk-->", createdTask)
            const createdTaskIds = createdTask.map(task => task._id);
            await userTask.findOneAndUpdate(
                { _id: toObjectId(taskId), userId: toStringId(_id), groupId: groupId },
                { $push: { taskLogIds: { $each: createdTaskIds } } },
                { new: true }
            );
            return createdTask;
        }
    } catch (error) {
        logger.error(error)
        console.log(error);
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        )
    }
}

export const getBulkAudiosService = async (requestUser, queryData) => {
    try {
        const { _id } = requestUser;
        const { taskId, groupId } = queryData;
        if (!taskId) {
            throw new APIError(
                "collectionId is required",
                HttpStatusCode.BAD_REQUEST,
                true,
                "collectionId is not found"
            );
        }
        // we can add pagination in future if required

        // const page = parseInt(queryData.page) || 1;
        // const limit = parseInt(queryData.limit) || 10;
        // const skip = (page - 1) * limit;

        const aggr = [
            {
                $match: {
                    groupId: groupId,
                    _id: toObjectId(taskId),
                    userId: toStringId(_id),
                    taskType: taskTypeEnum.GROUP
                }
            },
            {
                $lookup: {
                    from: "usertasklogs",
                    localField: "taskLogIds",
                    foreignField: "_id",
                    as: "taskLogs"
                }
            },
            {
                $unwind: {
                    path: "$taskLogs",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    "taskLogs.createdAt": -1
                }
            },
            {
                $project: {
                    _id: 1,
                    taskLogs: {
                        _id: 1,
                        groupId: 1,
                        taskId: 1,
                        audioDetails: 1,
                    }
                }
            },
            // {
            //     $skip: skip
            // },
            // {
            //     $limit: limit
            // }
        ]
        const response = await userTask.aggregate(aggr);
        return response;

    } catch (error) {
        logger.error("ERROR in getting bulk Audio api", error)
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        )
    }
}

export const getAllBulkAudioName = async (requestUser, queryData) => {
    try {
        const { _id } = requestUser;
        const { groupId } = queryData;
        if (!groupId) {
            throw new APIError(
                "groupId is required",
                HttpStatusCode.BAD_REQUEST,
                true,
                "groupId is not found"
            );
        }
        const aggr = [
            {
                $match: {
                    groupId: groupId,
                    userId: _id.toString(),
                }
            },
            {
                $project: {
                    _id: 1,
                    groupId: 1,
                    fileName: 1,
                }
            }
        ]
        const response = await userAudio.aggregate(aggr);
        return response;
    } catch (error) {
        logger.error("ERROR in getting bulk Audio api", error)
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        )
    }
}

export const getAudioDetailService = async (requestUser, params) => {
    try {
        const { _id } = requestUser;
        const { taskId } = params;
        const taskLogDetails = await userTaskLog.findOne({ userId: _id.toString(), _id: taskId });
        if (!taskLogDetails) {
            throw new APIError(
                "Task not found",
                HttpStatusCode.BAD_REQUEST,
                true,
                "Task not found"
            );
        }
        return taskLogDetails;
    } catch (error) {
        logger.error("ERROR in getting bulk Audio api", error)
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        )
    }
}

export const updateAudioDetailsService = async (requestUser, requestData, params) => {
    try {
        const { _id } = requestUser;
        const { taskId } = params;
        const { error: dataError } = validateAudioDetail(requestData);
        console.log("dataError", dataError);
        if (dataError) {
            throw new APIError(
                "Validation Error",
                HttpStatusCode.BAD_REQUEST,
                true,
                dataError.details[0].message
            );
        }
        const { theme, character, style, orientation, audioId } = requestData;

        const sourceAudio = await userAudio.findOne({
            userId: toStringId(_id),
            _id: toObjectId(audioId)
        })
        console.log("userAudio-->", userAudio)

        let updateQuery = {
            "audioDetails.theme": theme,
            "audioDetails.character": character,
            "audioDetails.style": style,
            "audioDetails.orientation": orientation
        };
        updateQuery = {
            ...updateQuery,
            "audioDetails.audioId": sourceAudio._id,
            audioUrl: sourceAudio.audioUrl,
            audioPath: sourceAudio.audioPath,
            "audioDetails.originalFileName": sourceAudio.fileName,
            "audioDetails.mimeType": sourceAudio.mimeType
        };

        const updatedTaskLog = await userTaskLog.findOneAndUpdate(
            { _id: taskId, userId: toStringId(_id) },
            { $set: updateQuery },
            { new: true }
        );
        return updatedTaskLog;
    } catch (error) {
        logger.error("ERROR in updating audio details", error);
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        );
    }
}

export const addSingleAudioService = async (requestUser, requestData) => {
    try {
        const { _id } = requestUser;
        const { error: dataError } = validateAudioDetail(requestData);
        console.log("dataError", dataError);
        if (dataError) {
            throw new APIError(
                "Validation Error",
                HttpStatusCode.BAD_REQUEST,
                true,
                dataError.details[0].message
            );
        }
        const { theme, character, style, orientation, audioId } = requestData;
        const sourceAudio = await userTaskLog.findOne({ userId: _id.toString(), _id: audioId });
        if (!sourceAudio) {
            throw new APIError(
                "Source audio not found",
                HttpStatusCode.BAD_REQUEST,
                true,
                "Source audio not found"
            );
        }
        const createdNewAudioTask = await userTaskLog.create(
            {
                userId: _id.toString(),
                taskId: sourceAudio.taskId,
                taskName: sourceAudio.taskName,
                isAudioUpload: true,
                audioUrl: sourceAudio.audioUrl,
                audioPath: sourceAudio.audioPath,
                groupId: sourceAudio.groupId,
                audioDetails: {
                    originalFileName: sourceAudio.audioDetails.originalFileName,
                    collectionName: sourceAudio.audioDetails.collectionName,
                    theme: theme,
                    character: character,
                    style: style,
                    orientation: orientation
                },
                audioMetadata: {
                    originalName: sourceAudio.audioMetadata.originalName,
                    mimeType: sourceAudio.audioMetadata.mimeType
                }
            }
        );
        await userTask.findOneAndUpdate(
            { _id: sourceAudio.taskId, userId: _id.toString(), groupId: sourceAudio.groupId },
            { $push: { taskLogIds: createdNewAudioTask._id } },
        );
        return createdNewAudioTask;
    } catch (error) {
        logger.error("ERROR in updating audio details", error);
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        );
    }
}