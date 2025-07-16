import Joi from "joi";

export const createSalesmanValidator = (data) => {
  const product = Joi.object({
    username: Joi.string().min(4).required(),
    full_name: Joi.string().required().trim(),
    phoneNumber: Joi.string()
      .regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/)
      .required(),
    address: Joi.string().required().trim(),
    email: Joi.string()
      .email()
      .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .required(),

    password: Joi.string().required(),
  });
  return product.validate(data);
};

export const updateSalesmanValidator = (data) => {
  const product = Joi.object({
    username: Joi.string().min(4).required().optional(),
    full_name: Joi.string().required().trim().optional(),
    phoneNumber: Joi.string()
      .regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/)
      .required()
      .optional(),
    address: Joi.string().required().trim().optional(),
    email: Joi.string()
      .email()
      .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .required()
      .optional(),

    password: Joi.string().required().optional(),
  });
  return product.validate(data);
};
