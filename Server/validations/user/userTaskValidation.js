import joi from "joi";
import { visualStyleEnum, OrientationEnum } from "../../enums/ENUMS.js";

const queryValidation = joi.object({
    isExcelUpload: joi.number()
        .valid(0, 1)
        .messages({
            'number.base': 'isExcelUpload must be a number',
            'any.only': 'isExcelUpload must be either 0 or 1'
        })
});

export const validateQuery = (data) => {
    return queryValidation.validate(data, { abortEarly: false });
};

const audioDetailsSchema = joi.object({
    id: joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid ObjectId format',
            'string.empty': 'ID is required',
            'any.required': 'ID is required'
        }),
    name: joi.string()
        .required()
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
    theme: joi.string()
        .required()
        .messages({
            'string.empty': 'Theme is required',
            'any.required': 'Theme is required'
        }),
    character: joi.string()
        .required()
        .messages({
            'string.empty': 'Character is required',
            'any.required': 'Character is required'
        }),
    style: joi.string()
        .required()
        .valid(...Object.values(visualStyleEnum))
        .messages({
            'string.empty': 'Style is required',
            'any.required': 'Style is required',
            'any.only': 'Style must be one of: REALISTIC, CARTOON, SKETCH'
        }),
    orientation: joi.string()
        .required()
        .valid(...Object.values(OrientationEnum))
        .messages({
            'string.empty': 'Orientation is required',
            'any.required': 'Orientation is required',
            'any.only': 'Orientation must be one of: PORTRAIT, LANDSCAPE, SQUARE'
        })
});

const bulkAudioDetailsValidation = joi.object({
    audioDetails: joi.array()
        .items(audioDetailsSchema)
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one audio detail is required',
            'array.base': 'Audio details must be an array',
            'any.required': 'Audio details are required'
        })
});

export const validateBulkAudioDetails = (data) => {
    return bulkAudioDetailsValidation.validate(data, { abortEarly: false });
};

export const validateSingleAudioDetails = (data) => {
    return audioDetailsSchema.validate(data, { abortEarly: false });
};

const updateAudioDetailSchema = joi.object({
    audioId: joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid ObjectId format',
            'string.empty': 'ID is required',
            'any.required': 'ID is required'
        }),
    theme: joi.string()
        .optional()
        .messages({
            'string.empty': 'Theme is required',
            'any.required': 'Theme is required'
        }),
    character: joi.string()
        .optional()
        .messages({
            'string.empty': 'Character is required',
            'any.required': 'Character is required'
        }),
    style: joi.string()
        .optional()
        .valid(...Object.values(visualStyleEnum))
        .messages({
            'string.empty': 'Style is required',
            'any.required': 'Style is required',
            'any.only': 'Style must be one of: REALISTIC, CARTOON, SKETCH'
        }),
    orientation: joi.string()
        .optional()
        .valid(...Object.values(OrientationEnum))
        .messages({
            'string.empty': 'Orientation is required',
            'any.required': 'Orientation is required',
            'any.only': 'Orientation must be one of: PORTRAIT, LANDSCAPE, SQUARE'
        })
});

export const validateAudioDetail = (data) => {
    return updateAudioDetailSchema.validate(data, { abortEarly: false });
};