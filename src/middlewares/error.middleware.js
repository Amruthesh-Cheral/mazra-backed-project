const errorHandler = (err, req, res, next) => {
  // Log the error (consider using a logger like Winston or Morgan in production)
  console.error(`[${new Date().toISOString()}]`, err);

  // Default to 500 if statusCode not set
  const statusCode = err.statusCode || 500;

  // Prepare error response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Handle Mongoose validation errors (automatically caught by `catchAsync`)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    errorResponse.message = `Validation Error: ${messages.join(', ')}`;
    errorResponse.statusCode = 400; // Bad Request
  }

  // Handle duplicate key errors (e.g., unique email)
  if (err.code === 11000) {
    errorResponse.message = `Duplicate field value: ${Object.keys(err.keyValue)[0]}`;
    errorResponse.statusCode = 409; // Conflict
  }

  // Handle JWT errors (if using authentication)
  if (err.name === 'JsonWebTokenError') {
    errorResponse.message = 'Invalid token';
    errorResponse.statusCode = 401; // Unauthorized
  }

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

export default errorHandler;