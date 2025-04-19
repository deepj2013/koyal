import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { bulkAudioUpload, downloadAudioExcel, singleAudioUpload } from '../controllers/uploadController.js';
import { validateAudioFiles, validateSingleAudioFile } from '../middleware/audioValidation.js';
import { updateSceneData } from '../controllers/aiController.js';
const router = express.Router()

router.post('/bulk-upload', userAuth, validateAudioFiles('audioFiles'), bulkAudioUpload);
router.get('/download-excel', userAuth, downloadAudioExcel);
router.post("/single-upload", userAuth, validateSingleAudioFile('audioFile'), singleAudioUpload)

export default router;