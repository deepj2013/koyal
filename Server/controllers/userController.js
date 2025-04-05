import { userLoginService, userSignupService } from "../services/userService.js";
import logger from "../utils/logger.js";

const userLoginController = async (req, res, next) => {
    try {
        const response = await userLoginService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        logger.error("Error in user controller", error);
        next(error);
    }
}

const userSignupController = async (req, res, next) => {
    try {
        const response = await userSignupService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        logger.error("Error in user sign in api-->", error);
        console.log(error);
        next(error);
    }
}

export {
    userLoginController,
    userSignupController
}