import multer from 'multer';
import APIError, { HttpStatusCode } from '../exception/errorHandler.js';
import { audioFileTypes } from '../config.js';

const storage = multer.memoryStorage();

const audioUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!audioFileTypes.includes(file.mimetype)) {
      return cb(new APIError(
        'Invalid file type',
        HttpStatusCode.BAD_REQUEST,
        true,
        'Only MP3 and WAV files are allowed'
      ), false);
    }
    cb(null, true);
  }
});

// middleware for validating audio files
export const validateAudioFiles = (fieldName = 'audioFiles') => {
  return (req, res, next) => {
    audioUpload.array(fieldName)(req, res, (err) => {

      if (err) {
        let errorMessage;

        if (err instanceof multer.MulterError) {
          errorMessage = err.message;
        }
        else if (err instanceof APIError) {
          errorMessage = err.message;
        }
        else {
          errorMessage = 'Error processing audio files';
        }
        return next(new APIError(errorMessage, HttpStatusCode.BAD_REQUEST, true, errorMessage));
      }
      if (!req.files || req.files.length === 0) {
        return next(new APIError('No audio files provided', HttpStatusCode.BAD_REQUEST, true, 'You must upload at least one MP3 or WAV file'));
      }
      next();
    });
  };
};