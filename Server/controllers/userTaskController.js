import { bulkAudioDetailsService, getAllBulkAudioName, getAudioDetailService, getBulkAudiosService, updateAudioDetailsService } from "../services/userTaskService.js";
import logger from "../utils/logger.js";

export const addBulkTaskDetails = async (req, res, next) => {
    try {
        const requestData = req.body;
        const requestFile = req.file;
        const isExcelUpload = parseInt(req.query.isExcelUpload);
        const response = await bulkAudioDetailsService(requestData, requestFile, isExcelUpload);
        return res.status(200).json({
            success: true,
            message: "Bulk task details added successfully",
            data: response
        });
    } catch (error) {
        logger.error(error);
        next(error)
    }
}
export const getBulkAudioDetails = async (req, res, next) => {
    try {
        const response = await getBulkAudiosService(req.user, req.query);
        return res.status(200).json({
            success: true,
            message: "Bulk audio details fetched successfully",
            data: response
        });
    } catch (error) {
        logger.error("Error in getting getBulkAudio", error);
        next(error)
    }
}
export const getAllAudioNames = async (req, res, next) => {
    try {
        const response = await getAllBulkAudioName(req.user);
        return res.status(200).json({
            success: true,
            message: "All audio names fetched successfully",
            data: response
        });
    } catch (error) {
        logger.error("Error in getting getAllAudioNames", error);
        next(error)
    }
}
export const getBulkAudioDetailsByTaskId = async (req, res, next) => {
    try {
        const response = await getAudioDetailService(req.user, req.params);
        return res.status(200).json({
            success: true,
            message: "audio details fetched successfully",
            data: response
        });
    } catch (error) {
        logger.error("Error in getting getBulkAudio", error);
        next(error)
    }
}
export const updateAudioDetail = async (req, res, next) => {
    try {
        const response = await updateAudioDetailsService(req.user, req.body, req.params);
        res.status(200).json({
            success: true,
            message: "Audio details updated successfully",
            data: response
        })
    } catch (error) {
        logger.error("Error in getting updateAudioDetail", error);
        next(error)
    }
}

