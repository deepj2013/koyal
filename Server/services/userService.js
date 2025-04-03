import { roleEnum } from '../enums/ENUMS.js';
import APIError, { HttpStatusCode } from '../exception/errorHandler.js';
import { comparePassword, encryptPassword } from '../helpers/passwordEncryption/passwordEncryption.js';
import User from '../models/userModel.js';
import { validateLogin, validatesignup } from '../validations/user/userValidation.js';
import { generateTokenService, getTokenOfUserService } from './authServices.js';
import { createUserFolder } from './s3Service.js';
import logger from '../utils/logger.js';

const userLoginService = async (requestData) => {
    try {
        const { error } = validateLogin(requestData);
        console.log("validate error--->", error);
        if (error) {
            throw new APIError(
                'ValidationError',
                HttpStatusCode.BAD_REQUEST,
                true,
                error.details[0].message
            );
        }
        const { email, password } = requestData;

        const isExistsUser = await User.findOne({
            email,
        })
        if (!isExistsUser) {
            throw new APIError(
                'NotFoundError',
                HttpStatusCode.NOT_FOUND,
                true,
                'User not found.'
            );
        }
        const isPasswordMatched = await comparePassword(password, isExistsUser.password)
        if (isPasswordMatched) {
            let tokenObj = await getTokenOfUserService(isExistsUser._id);
            if (tokenObj == null || new Date().getTime() > tokenObj.expiresAt) {
                await generateTokenService(isExistsUser._id);
                tokenObj = await getTokenOfUserService(isExistsUser._id);
            }

            const createFolder = await createUserFolder(email);
            logger.info("createFolder--->", createFolder);

            return {
                token: tokenObj.token,
                expiresAt: tokenObj.expiresAt,
                name: isExistsUser.name,
                email: isExistsUser.email,
            };
        } else {
            throw new APIError(
                "UNAUTHORIZED_REQUEST",
                HttpStatusCode.UNAUTHORIZED_REQUEST,
                true,
                "Password does not match."
            );
        }

    } catch (error) {
        logger.error(error);
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        );
    }
}

const userSignupService = async (requestData) => {
    try {
        const { error } = validatesignup(requestData);
        if (error) {
            throw new APIError(
                'ValidationError',
                HttpStatusCode.BAD_REQUEST,
                true,
                error.details[0].message
            );
        }

        const { name, email, password } = requestData;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new APIError(
                'DuplicateError',
                HttpStatusCode.CONFLICT,
                true,
                'Email already registered'
            );
        }

        const hashedPassword = await encryptPassword(password);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: roleEnum.USER
        });

        return {
            success: true,
            status: HttpStatusCode.CREATED,
            message: "Signup successful",
            data: {
                userId: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        };

    } catch (error) {
        logger.error(error);
        throw new APIError(
            error.name,
            error.httpCode,
            error.isOperational,
            error.message
        );
    }
}


export {
    userLoginService,
    userSignupService
}