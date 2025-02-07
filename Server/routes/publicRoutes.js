import express from 'express';
import { createWaitingListController} from "../controllers/publicController.js";

const router = express.Router()

router.post("/createWaitingList", createWaitingListController);

// router.post('/joinwaitlist',)
// 

export default router