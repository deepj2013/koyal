import jwt from 'jsonwebtoken';
import APIError, { HttpStatusCode } from "../exception/errorHandler.js";

export const adminAuth = async (req, res, next) => {
  const validAdminIds = ['67a5b162760a44e56042f30f', '674752ffa5225cc67abe3b8d'];

  try {
    const token = req.headers['x-auth-token'];
    if (!token) {
      throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Unauthorized Token');
    }

    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log('Token Verified:', verify); // Log to check token details

    // Check token expiry time (adjusting for seconds in 'exp' claim)
    if (new Date().getTime() / 1000 > verify.exp) {
      throw new APIError("UNAUTHORIZED_REQUEST", HttpStatusCode.UNAUTHORIZED_REQUEST, true, 'Token has been expired. Kindly Relogin!');
    }

    // console.log('User ID:', verify.userId);
    if (!validAdminIds.includes(verify.userId.toString())) {
      throw new APIError(
        "UNAUTHORIZED_REQUEST",
        HttpStatusCode.UNAUTHORIZED_REQUEST,
        true,
        'This token does not belong to admin!'
      );
    }

    next();
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(error);
  }
};
