import Joi from "joi";

export const createAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().min(4).required(),
    email: Joi.string()
      .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .required(),
    phoneNumber: Joi.string()
      .regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/)
      .required(),
    password: Joi.string().required(),
  });
  return admin.validate(data);
};

export const updateAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().min(4).required().optional(),
    email: Joi.string()
      .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .required()
      .optional(),
    phoneNumber: Joi.string()
      .regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/)
      .required()
      .optional(),
    password: Joi.string().required().optional(),
  });
  return admin.validate(data);
};

export const signInAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().min(4),
    password: Joi.string().required(),
  });
  return admin.validate(data);
};
