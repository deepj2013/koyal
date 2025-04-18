import APIError from "../exception/errorHandler.js";
import { uploadJSONFileToS3 } from "./s3Service.js";

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