export const sendSuccess = (
  res,
  data,
  message = "Success",
  statusCode = 200,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res,
  message = "Error",
  statusCode = 400,
  error = null,
) => {
  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export const sendValidationError = (res, errors) => {
  res.status(400).json({
    success: false,
    message: "Validation failed",
    error: errors,
  });
};

export default {
  sendSuccess,
  sendError,
  sendValidationError,
};
