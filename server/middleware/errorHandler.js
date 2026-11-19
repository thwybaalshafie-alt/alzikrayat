const multer = require('multer');

function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

function errorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File Too Large',
        message: 'Image file size must not exceed 8 MB',
      });
    }
    return res.status(400).json({
      error: 'Upload Error',
      message: err.message,
    });
  }

  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      error: 'Invalid File Type',
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: details[0] || 'Invalid input data',
      details,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid Identifier',
      message: `Invalid value for ${err.path}`,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      error: 'Conflict',
      message: `A record with that ${field} already exists`,
    });
  }

  const statusCode = err.statusCode || 500;
  console.error('[Server Error]', err);

  return res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : 'Request Error',
    message: err.message || 'An unexpected error occurred',
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
