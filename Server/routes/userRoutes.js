import express from 'express';
const router = express.Router()
import { userLoginController, userSignupController } from '../controllers/userController.js';
import { adminAuth } from '../middleware/adminAuth.js';

router.get('/health', (req, res) => {
    res.send('User Routes');
});
router.post('/userLogin', userLoginController);
router.post('/createUser',adminAuth, userSignupController);


export default router;