import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { bulkAudioUpload } from '../controllers/uploadController.js';
import { validateAudioFiles } from '../middleware/audioValidation.js';
const router = express.Router()

router.post('/bulk-upload', userAuth, validateAudioFiles('audioFiles'), bulkAudioUpload);

export default router;