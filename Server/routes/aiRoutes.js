import express from 'express'
import { audioProcess } from '../controllers/aiController.js'
import { userAuth } from '../middleware/userAuth.js'
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Hello from aiRoutes")
})

router.post("/process-audio", userAuth, audioProcess);

export default router