const log = require("pino")();

const createValidateMiddleware = schema => async (req, res, next) => {
  const options = {
    abortEarly: false,
    stripUnknown: true,
  };

  try {
    if (schema.query) {
      req.query = await schema.query.validate(req.query, options);
    }
    if (schema.body) {
      req.body = await schema.body.validate(req.body, options);
    }
    if (schema.params) {
      req.params = await schema.params.validate(req.params, options);
    }
    return next();
  } catch (error) {
    log.error({
      context: {
        originalUrl: req.originalUrl,
        body: req.body,
      },
      error,
    });
    return res.status(400).json({
      error,
    });
  }
};

module.exports = createValidateMiddleware;
