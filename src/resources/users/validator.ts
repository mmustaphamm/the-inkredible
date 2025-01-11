import Joi from "joi";

export const createUserValidator = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(2).required(),
  middleName: Joi.string().min(2).optional(),
  lastName: Joi.string().min(2).required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.string().min(8).required(),
});

export const createVerifyValidator = Joi.object({
  email: Joi.string().required(),
  token: Joi.string().min(6).max(6).required(),
});

export const userLoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
