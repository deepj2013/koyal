import Joi from "joi";

const loginValidation = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email',
            'any.required': 'Email is required'
        }),
    
    password: Joi.string().required()
});
export const validateLogin = (data) => {
    return loginValidation.validate(data, { abortEarly: false });
};

const signupValidation = Joi.object({
    name: Joi.string()
       .required()
       .messages({
           'string.empty': 'Name is required',
           'any.required': 'Name is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email',
            'any.required': 'Email is required'
        }),
        
    password: Joi.string()
    .required()
    .min(6)
    .pattern(/^(?=.*[A-Za-z]{4,})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
    .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.pattern.base': 'Password must contain at least 4 letters, one number and one special character',
        'any.required': 'Password is required'
    })

});

export const validatesignup = (data) => {
    return signupValidation.validate(data, { abortEarly: false });
};
