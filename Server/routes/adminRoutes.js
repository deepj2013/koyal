import express from 'express'
import { adminLoginController, adminSignupController } from '../controllers/adminController.js'
import { getAllWaitingListController } from '../controllers/publicController.js'
import { adminAuth } from '../middleware/adminAuth.js'
import { getErrorLogs } from '../controllers/errorLogController.js'

const router = express.Router()

router.post('/login', adminLoginController)
router.post('/signup', adminSignupController)
router.get("/getWaitingList", getAllWaitingListController);
router.get("/error-logs", adminAuth, getErrorLogs);


export default router