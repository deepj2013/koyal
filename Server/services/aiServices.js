import APIError from "../exception/errorHandler";

export const createAiApi = async () => {
    try {

    } catch (error) {
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        );
    }
};