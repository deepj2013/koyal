import express from 'express'
import { audioProcess, updateSceneData, uploadCharchaImages } from '../controllers/aiController.js'
import { userAuth } from '../middleware/userAuth.js'
import { charchaUploadMiddleware } from '../helpers/multer/multer.js'
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Hello from aiRoutes")
})

router.post("/process-audio", userAuth, audioProcess);
router.put("/update-scene-data", userAuth, updateSceneData);
router.post("/upload-charcha-images", userAuth, charchaUploadMiddleware, uploadCharchaImages);

export default router