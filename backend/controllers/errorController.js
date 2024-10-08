import CustomError from "../utils/CustomError.js";

const castErrorHandler = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new CustomError(message, 400);
};

const duplicateFieldsHandler = (error) => {
  const name = error.keyValue.name;
  const message = `Duplicate field value: ${name}`;
  return new CustomError(message, 400);
};

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((obj) => obj.message);
  const errorMessage = errors.join(". ");
  const message = `${errorMessage}`;
  return new CustomError(message, 400);
};

const handleSpecificErrors = (error) => {
  if (error.name === "CastError") {
    return castErrorHandler(error);
  } else if (error.code === 11000) {
    return duplicateFieldsHandler(error);
  } else if (error.name === "ValidationError") {
    return validationErrorHandler(error);
  }
  return error; // Return original error if not handled
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  // Handle specific errors first
  const handledError = handleSpecificErrors(error);

  // Set response based on environment
  if (process.env.NODE_ENV === "development") {
    res.status(handledError.statusCode).json({
      status: handledError.status,
      message: handledError.message,
      stack: error.stack,
      error,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (handledError.isOperational) {
      res.status(handledError.statusCode).json({
        status: handledError.status,
        message: handledError.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};

export default globalErrorHandler;
