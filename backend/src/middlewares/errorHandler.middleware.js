import { apiError } from '../utils/apiError.js';

const errorHandler = (err, req, res, next) => {
    
  if (err instanceof apiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }


  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export { errorHandler };