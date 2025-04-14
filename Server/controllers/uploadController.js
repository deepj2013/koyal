import { bulkAudioUploadService, downloadAudioExcelService } from '../services/uploadService.js';
import logger from '../utils/logger.js';

export const bulkAudioUpload = async (req, res, next) => {
    try {
        const audioFiles = req.files;
    
        const user = req.user;

        const uploadedFiles = await bulkAudioUploadService(audioFiles, user);

        return res.status(200).json({
            success: true,
            message: "Audio files uploaded successfully",
            data: {
                files: uploadedFiles,
                count: uploadedFiles.length
            }
        });
    } catch (error) {
        logger.error('Bulk upload controller error:', error);
        next(error);
    }
}
export const downloadAudioExcel = async (req, res, next) => {
    try {
        const buffer = await downloadAudioExcelService(req.user, req.query);

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=audio_template.xlsx'
        );
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.send(buffer); 
    } catch (error) {
        logger.error("Error in getting downloadAudioExcel", error);
        next(error);
    }
};
