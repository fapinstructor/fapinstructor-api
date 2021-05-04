const log = require("lib/logger");

function errorHandler(error, req, res, _next) {
  if (error.status !== 404) {
    log.error({
      context: {
        originalUrl: req.originalUrl,
        method: req.method,
        body: req.body,
        headers: {
          ...req.headers,
          authorization: req.headers.authorization && "REDACTED",
        },
        user: req.user,
      },
      error: {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack,
      },
    });
  }

  res.status(error.status || 500);
  res.json({ message: error.message });
}

module.exports = errorHandler;
