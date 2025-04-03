import { userLoginService, userSignupService } from "../services/userService.js";

const userLoginController = async (req, res, next) => {
    try {
        const response = await userLoginService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

const userSignupController = async (req, res, next) => {
    try {
        const response = await userSignupService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export {
    userLoginController,
    userSignupController
}