import Joi from "joi";

export const createProductValidator = (data) => {
  const product = Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    price: Joi.string().required().trim(),
    quantity: Joi.number().required(),
    color: Joi.string().required().trim(),
    category_id: Joi.string().required().trim(),
    salesman_id: Joi.string().required().trim(),
  });
  return product.validate(data);
};


export const updateProductValidator = (data) => {
  const product = Joi.object({
    name: Joi.string().required().trim().optional(),
    description: Joi.string().required().trim().optional(),
    price: Joi.string().required().trim().optional(),
    quantity: Joi.number().required().optional(),
    color: Joi.string().required().trim().optional(),
    category_id: Joi.string().required().trim().optional(),
    salesman_id: Joi.string().required().trim().optional(),
  });
  return product.validate(data);
};