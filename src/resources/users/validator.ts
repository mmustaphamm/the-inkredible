import Joi from "joi";

export const createUserValidator = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(2).required(),
  middleName: Joi.string().min(2).optional(),
  lastName: Joi.string().min(2).required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  confirm_password: Joi.string().min(8).valid(Joi.ref("password")).required(),
});

export const createVerifyValidator = Joi.object({
  email: Joi.string().required(),
  token: Joi.string().min(6).max(6).required(),
});

export const userLoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserValidator = Joi.object({
  firstName: Joi.string().min(2).optional(),
  middleName: Joi.string().min(2).optional(),
  lastName: Joi.string().min(2).optional(),
});
