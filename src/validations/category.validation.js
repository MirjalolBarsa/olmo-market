import Joi from "joi";

export const createCategoryValidator = (data) => {
  const category = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  return category.validate(data);
};

export const updateCategoryValidator = (data) => {
  const category = Joi.object({
    name: Joi.string().required().optional(),
    description: Joi.string().required().optional(),
  });
  return category.validate(data);
};
