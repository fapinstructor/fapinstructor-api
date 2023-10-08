const express = require("express");
require("express-async-errors");
const createError = require("http-errors");
const cors = require("cors");
require("../lib/validation/setupYup");
const errorHandler = require("./middleware/errorHandler");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { WHITE_LIST } = require("../../src/config");

module.exports = {
  start() {
    const app = express();
    app.use(jsonParser);
    const whitelist = WHITE_LIST.split(",");
    app.use(
      cors({
        origin: whitelist,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    const routes = require("./routes");
    app.use(routes);
    app.use((req, _res, next) => {
      next(createError.NotFound(`Path not found: ${req.path}`));
    });
    app.use(errorHandler);

    return app;
  },
};
