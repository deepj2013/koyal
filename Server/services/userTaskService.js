import { request } from "express";
import { taskTypeEnum } from "../enums/ENUMS.js";
import APIError, { HttpStatusCode } from "../exception/errorHandler.js";
import userTaskLog from "../models/userTaskLogModel.js";
import userTask from "../models/userTaskModel.js";
import logger from "../utils/logger.js";
import { checkXlsxFile, xlsxtojson } from "../utils/xlsxToJson.js";
import { validateAudioDetail, validateBulkAudioDetails, validateQuery } from "../validations/user/userTaskValidation.js";

export const bulkAudioDetailsService = async (requestData, requestFile, isExcelUpload) => {
    try {
        const { error: queryError } = validateQuery({ isExcelUpload });
        if (queryError) {
            throw new APIError(
                "BAD_INPUT",
                HttpStatusCode.BAD_REQUEST,
                true,
                queryError.details[0].message
            );
        }
        let response = [];
        if (isExcelUpload === 1) {
            if (!checkXlsxFile(requestFile)) {
                throw new APIError(
                    "Invalid file format",
                    HttpStatusCode.BAD_REQUEST,
                    true,
                    "Invalid file format file should be xlsx & xls"
                );
            }
            const { buffer } = requestFile;
            const { status, message, data } = await xlsxtojson(buffer);
            if (status == 400 || status == 500) {
                throw new APIError(
                    message,
                    HttpStatusCode.BAD_REQUEST,
                    true,
                    message
                );
            }
            const { error: dataError } = validateBulkAudioDetails({ audioDetails: data });
            if (dataError) {
                throw new APIError(
                    "Validation Error",
                    HttpStatusCode.BAD_REQUEST,
                    true,
                    dataError.details[0].message
                );
            }
            for (let task of data) {
                const { id, name, theme, character, style, orientation } = task;
                const result = await userTaskLog.findOneAndUpdate({ _id: id }, {
                    $set: {
                        "audioDetails.collectionName": name,
                        "audioDetails.theme": theme,
                        "audioDetails.character": character,
                        "audioDetails.style": style,
                        "audioDetails.orientation": orientation
                    }
                }, { new: true })
                response.push(result);
            }
        } else {
            const { audioDetails } = requestData;
            const { error: dataError } = validateBulkAudioDetails({ audioDetails });
            if (dataError) {
                throw new APIError(
                    "Validation Error",
                    HttpStatusCode.BAD_REQUEST,
                    true,
                    dataError.details[0].message
                );
            }

            for (let task of audioDetails) {
                const { id, name, theme, character, style, orientation } = task;
                const result = await userTaskLog.findOneAndUpdate({ _id: id }, {
                    $set: {
                        "audioDetails.collectionName": name,
                        "audioDetails.theme": theme,
                        "audioDetails.character": character,
                        "audioDetails.style": style,
                        "audioDetails.orientation": orientation
                    }
                }, { new: true })
                response.push(result);
            }
        }
        return response;
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
        // we can add pagination in future if required

        // const page = parseInt(queryData.page) || 1;
        // const limit = parseInt(queryData.limit) || 10;
        // const skip = (page - 1) * limit;

        const aggr = [
            {
                $match: {
                    userId: _id.toString(),
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
                        audioDetails: 1,
                        audioMetadata: 1,
                        audioUrl: 1,
                        audioPath: 1,
                        audioMetaData: 1,
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

export const getAllBulkAudioName = async (requestUser) => {
    try {
        const { _id } = requestUser;
        const aggr = [
            {
                $match: {
                    userId: _id.toString(),
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
                        audioDetails: {
                            originalFileName: 1,
                        },
                    }
                }
            }
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
        if (dataError) {
            throw new APIError(
                "Validation Error",
                HttpStatusCode.BAD_REQUEST,
                true,
                dataError.details[0].message
            );
        }
        const { theme, character, style, orientation, audioId } = requestData;

        let updateQuery = {
            "audioDetails.theme": theme,
            "audioDetails.character": character,
            "audioDetails.style": style,
            "audioDetails.orientation": orientation
        };
        if (audioId) {
            const sourceAudio = await userTaskLog.findOne({ userId: _id.toString(), _id: audioId });
            if (!sourceAudio) {
                throw new APIError(
                    "Source audio not found",
                    HttpStatusCode.BAD_REQUEST,
                    true,
                    "Source audio not found"
                );
            }
            updateQuery = {
                ...updateQuery,
                audioUrl: sourceAudio.audioUrl,
                audioPath: sourceAudio.audioPath,
                "audioDetails.originalFileName": sourceAudio.audioDetails.originalFileName,
                "audioMetadata.originalName": sourceAudio.audioMetadata.originalName,
                "audioMetadata.mimeType": sourceAudio.audioMetadata.mimeType
            };
        }

        const updatedTaskLog = await userTaskLog.findOneAndUpdate(
            { _id: taskId, userId: _id.toString() },
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