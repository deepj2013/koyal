import express from 'express';
const router = express.Router()
import { userAuth } from '../middleware/userAuth.js';
import { addBulkTaskDetails, addSingleTaskDetails, getAllAudioNames, getBulkAudioDetails, getBulkAudioDetailsByTaskId, updateAudioDetail } from '../controllers/userTaskController.js';
import upload from '../helpers/multer/multer.js';

router.get('/health', (req, res) => {
    res.send('User Task Routes');
});

// ** yha pr ek audio upload bala mera upload routes me available hai**
router.put('/update-bulk-audio-details', userAuth, upload.single('audioDetails'), addBulkTaskDetails);
router.get('/get-bulk-audio-details', userAuth, getBulkAudioDetails)
router.get('/get-all-audio-name', userAuth, getAllAudioNames);
router.get('/get-audio-details/:taskId', userAuth, getBulkAudioDetailsByTaskId);
router.put('/update-audio-details/:taskId', userAuth, updateAudioDetail);
router.post('/add-audio-task', userAuth, addSingleTaskDetails)

export default router;  