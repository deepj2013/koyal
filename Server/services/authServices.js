import APIError from "../exception/errorHandler.js";
import Token from "../models/tokeModel.js";
import jwt from "jsonwebtoken";


//#region Generate JWT Token
export const generateTokenService = async (userId) => {
    try {
      //generate new token
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
      let generatedTime = new Date().getTime();
      let tokenExpiryTime = generatedTime + 24 * 60 * 60 * 1000; // Token Expires In 1 Day
  
      let data = {
        userId,
        tokenExpiryTime: tokenExpiryTime,
      };
  
      const token = jwt.sign(data, jwtSecretKey);
  
      // Deleting Previous Token
      await Token.findOneAndDelete({ userId: userId });
  
      // Creating Token Object To Store In DB
      let tokenObject = {
        userId: userId,
        token: token,
        expiresAt: tokenExpiryTime,
      };
  
      let tokenData = await Token.create(tokenObject);
      await tokenData.save();
  
      // Resolve Promise
      return Promise.resolve();
    } catch (error) {
      throw new APIError(
        error.name,
        error.httpCode,
        error.isOperational,
        error.message
      );
    }
  };
  //#endregion
  //#region Get Token Of User
  export const getTokenOfUserService = async (userId) => {
    try {
      //#region Token Pipeline
      let tokenPipeline = [
        {
          $match: {
            userId: userId,
          },
        },
      ];
      //#endregion
    console.log(userId);
      //#region Aggregate Token
      let res = await Token.aggregate(tokenPipeline);
      if (res.length > 0) {
        return res[0];
      } else {
        return null;
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
  //#endregion