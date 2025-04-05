import { bulkAudioUploadService } from '../services/uploadService.js';
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