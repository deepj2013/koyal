import multer from 'multer';
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 200,
    },
});

export const charchaUploadMiddleware = upload.fields([
   // { name: 'calibrationImage', maxCount: 1 },
    { name: 'charchaImages' }
]);


export default upload;