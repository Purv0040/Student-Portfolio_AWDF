export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const formatValidationErrors = (error) =>
  Object.values(error.errors || {}).map((validationError) => ({
    field: validationError.path,
    message: validationError.message,
    kind: validationError.kind,
  }));

export const errorHandler = (err, _req, res, _next) => {
  console.error('[Error Handler]:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation failed',
      errors: formatValidationErrors(err),
    });
    return;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    res.status(400).json({
      message: 'Invalid resource identifier',
      errors: [
        {
          field: err.path,
          message: `Invalid ${err.path}: ${err.value}`,
          kind: err.kind,
        },
      ],
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      message: 'Invalid token. Please log in again.',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      message: 'Token expired. Please log in again.',
    });
    return;
  }

  // MongoDB duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    res.status(409).json({
      message: `Duplicate value for ${field}. This ${field} is already in use.`,
    });
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 ? (err.message || 'Internal Server Error') : err.message;

  res.status(statusCode).json({
    message,
    ...(err.details ? { errors: err.details } : {}),
  });
};