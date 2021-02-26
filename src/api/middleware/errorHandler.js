const log = require("lib/logger");

function errorHandler(error, req, res, _next) {
  if (error.status !== 404) {
    log.error({
      context: {
        originalUrl: req.originalUrl,
        body: req.body,
        headers: {
          ...req.headers,
          authorization: req.headers.authorization && "REDACTED",
        },
        user: req.user,
      },
      error,
    });
  }

  res.status(error.status || 500);
  res.json({ message: error.message });
}

module.exports = errorHandler;
