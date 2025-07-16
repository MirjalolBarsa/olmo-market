import Joi from "joi";

export const createClientValidator = (data) => {
  const client = Joi.object({
    full_name: Joi.string().required().trim(),
    email: Joi.string().email(),
  });
  return client.validate(data);
};

export const updateClientValidator = (data) => {
  const client = Joi.object({
    full_name: Joi.string().required().trim().optional(),
    email: Joi.string().email().optional(),
  });
  return client.validate(data);
};

export const signUpClientValidator = (data) => {
  const client = Joi.object({
    full_name: Joi.string().required().trim(),
    email: Joi.string().email(),
  });
  return client.validate(data);
};

export const signInClientValidator = (data) => {
  const client = Joi.object({
    email: Joi.string().email(),
  });
  return client.validate(data);
};

export const confirmSignInClientValidator = (data) => {
  const client = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  });
  return client.validate(data);
};
