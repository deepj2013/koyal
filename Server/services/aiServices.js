import APIError from "../exception/errorHandler.js";
import { createS3Folder, uploadFileToS3, uploadJSONFileToS3 } from "./s3Service.js";

export const updateSceneDataService = async (requestData, requestUser) => {
    try {
        const { sceneUrl, newSceneData } = requestData;
        const { email } = requestUser;
        if (!sceneUrl || !newSceneData) {
            throw new APIError(
                "Validation Error",
                HttpStatusCode.BAD_REQUEST,
                true,
                "sceneUrl and newSceneData are required"
            );
        }
        const urlParts = decodeURIComponent(sceneUrl).split('/');
        const fileName = urlParts.slice(3).join('/');

        const lyricsUrl = await uploadJSONFileToS3(newSceneData, fileName, email);

        return {
            lyricsUrl,
            SceneData: newSceneData
        }

    } catch (error) {
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        );
    }
};

export const uploadCharchaImagesService = async (requestData) => {
    try {
        const {
            calibrationImage,
            charchaImages,
            characterName,
            user
        } = requestData
        const email = user?.email;
        console.log("charchaImages-->", charchaImages)
        const folderName = 'CharchaImages';
        const folderPath = await createS3Folder(email, folderName);
        const uploadPromises = [];

        // Upload calibration image as "email/calibration.jpg"
        // if (calibrationImage) {
        //     const calibrationUpload = uploadFileToS3(calibrationImage, '', email, 'calibration.jpg');
        //     uploadPromises.push(calibrationUpload);
        // }

        charchaImages?.forEach((file, index) => {
            const fileName = `image${index + 1}.jpg`;
            const upload = uploadFileToS3(file, folderName, email, fileName);
            uploadPromises.push(upload);
        });

        // Wait for all uploads
        const uploadedUrls =  await Promise.all(uploadPromises);

        return {
            folderPath,
            uploadedUrls,
        };
    } catch (error) {
        console.log("error-->", error)
        throw new APIError(
            error.name || "UploadError",
            error.httpCode || 500,
            error.isOperational || true,
            error.message || "Failed to upload Charcha images"
        );
    }
};
