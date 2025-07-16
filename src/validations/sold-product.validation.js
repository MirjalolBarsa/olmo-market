import Joi from "joi";

export const createSoldProductValidator = (data) => {
  const soldproduct = Joi.object({
    pqoduct_id: Joi.string().required(),
    client_id: Joi.string().required(),
    quantity: Joi.number().required(),
    totalPrice: Joi.string().optional(),
  });
  return soldproduct.validate(data);
};

export const updateSoldProductValidator = (data) => {
  const soldproduct = Joi.object({
    quantity: Joi.number().optional(),
  });
  return soldproduct.validate(data);
};
