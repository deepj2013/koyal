import express from 'express'
import { adminLoginController, adminSignupController } from '../controllers/adminController.js'
import { getAllWaitingListController } from '../controllers/publicController.js'
import { adminAuth } from '../middleware/adminAuth.js'



const router = express.Router()

router.post('/login', adminLoginController)
router.post('/signup', adminSignupController)
router.get("/getWaitingList", getAllWaitingListController);



export default router