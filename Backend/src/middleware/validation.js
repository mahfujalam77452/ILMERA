import { sendValidationError } from "../utils/response.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = {};
      error.details.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      return sendValidationError(res, errors);
    }

    req.validatedBody = value;
    next();
  };
};

export default validateRequest;
