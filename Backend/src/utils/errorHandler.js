export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDB ID error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err.statusCode = 400;
    err.message = message;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    err.statusCode = 400;
    err.message = message;
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid token`;
    err.statusCode = 401;
    err.message = message;
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = `Token has expired`;
    err.statusCode = 401;
    err.message = message;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : null,
  });
};

export default {
  AppError,
  catchAsync,
  globalErrorHandler,
};
