import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { bulkAudioUpload, downloadAudioExcel } from '../controllers/uploadController.js';
import { validateAudioFiles } from '../middleware/audioValidation.js';
const router = express.Router()

router.post('/bulk-upload', userAuth, validateAudioFiles('audioFiles'), bulkAudioUpload);
router.get('/download-excel', userAuth, downloadAudioExcel);

export default router;