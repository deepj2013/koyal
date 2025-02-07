import APIError, { HttpStatusCode } from "../exception/errorHandler.js";
import {
    comparePassword,
    encryptPassword,
  } from "../helpers/passwordEncryption/passwordEncryption.js";
  import Admin from "../models/adminModel.js"
import { generateTokenService, getTokenOfUserService } from "./authServices.js";

//#region Admin Signup Service
export const adminSignUpService = async (name, email, password) => {
    try {
      // Hashing Password
      password = await encryptPassword(password);
  
      //Preparing Object To Insert
      let adminObject = {
        name: name,
        email: email,
        password: password,
      };
  
      let admin = await Admin.create(adminObject);
      await admin.save();
  
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
  
  //#region Admin Login Service
  export const adminLoginService = async (userId, password) => {
    try {
      //#region User Pipeline
      let userPipeline = [
        {
          $project: {
            email: { $toLower: "$email" },
            status: "$status",
            password: "$password",
            name: "$name",
          },
        },
        {
          $match: {
            email: userId,
          },
        },
      ];
      //#endregion
  
      let result = await Admin.aggregate(userPipeline);
      if (result.length == 0) {
        throw new APIError(
          "UNAUTHORIZED_REQUEST",
          HttpStatusCode.UNAUTHORIZED_REQUEST,
          true,
          "User not found."
        );
      }
  
      let userDetails = result[0];
  
      let hashedPassword = userDetails.password;
  
      let isPasswordMatched = await comparePassword(password, hashedPassword);
  
      if (isPasswordMatched) {
        // getting Token of User
        let tokenObj = await getTokenOfUserService(userDetails._id);
  
        if (tokenObj == null || new Date().getTime() > tokenObj.expiresAt) {
          await generateTokenService(userDetails._id);
          // getting Token of User
          tokenObj = await getTokenOfUserService(userDetails._id);
        }
  
        return {
          token: tokenObj.token,
          expiresAt: tokenObj.expiresAt,
          userName: userDetails.name,
          email: userDetails.email,
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
      throw new APIError(
        error.name,
        error.httpCode,
        error.isOperational,
        error.message
      );
    }
  };
  //#endregion