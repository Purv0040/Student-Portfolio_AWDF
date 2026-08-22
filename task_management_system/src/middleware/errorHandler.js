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

  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation failed',
      errors: formatValidationErrors(err),
    });
    return;
  }

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

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 ? (err.message || 'Internal Server Error') : err.message;

  res.status(statusCode).json({
    message,
    ...(err.details ? { errors: err.details } : {}),
  });
};