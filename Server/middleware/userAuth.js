import jwt from 'jsonwebtoken';
import APIError, { HttpStatusCode } from "../exception/errorHandler.js";
import { roleEnum } from '../enums/ENUMS.js';
import User from '../models/userModel.js';

export const userAuth = async (req, res, next) => {
  try {
    const token = req.headers['x-auth-token'];
    if (!token) {
      throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Unauthorized Token');
    }

    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("verify--->", verify);

    if (new Date().getTime() / 1000 > verify.exp) {
      throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Token has been expired. Kindly Relogin!');
    }

    const user = await User.findById(verify.userId);
    if (!user || user.role !== roleEnum.USER) {
      throw new APIError(
        "UNAUTHORIZED_REQUEST",
        HttpStatusCode.UNAUTHORIZED_REQUEST,
        true,
        'This token does not belong to a user!'
      );
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};