const errorHandler = (err, req, res, next) => {
  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = null;

  // GitHub user not found
  if (err.isGitHubNotFound) {
    statusCode = 404;
    message = err.message;
  }

  // GitHub API rate limit
  if (err.isRateLimitError) {
    statusCode = 429;
    message = 'GitHub API rate limit exceeded. Please try again later.';
    details = err.details;
  }

  // Validation errors
  if (err.isValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    details = err.details;
  }

  // Database errors
  if (err.code && err.code.startsWith('ER_')) {
    statusCode = 500;
    message = 'Database error occurred';
    if (process.env.NODE_ENV === 'development') {
      details = err.message;
    }
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Send response
  const response = {
    success: false,
    message
  };

  if (details) {
    response.details = details;
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
