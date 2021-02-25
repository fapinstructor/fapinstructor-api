const express = require("express");
require("express-async-errors");
const createError = require("http-errors");
const cors = require("cors");
require("../lib/validation/setupYup");
const errorHandler = require("api/middleware/errorHandler");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

module.exports = {
  start() {
    const app = express();
    app.use(jsonParser);

    app.use(
      cors({
        origin: [
          "http://localhost:3000",
          "https://fapinstructor.com",
          "https://www.fapinstructor.com",
        ],
        methods: ["GET", "POST", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    const routes = require("./routes");
    app.use(routes);
    app.use((req, res, next) => {
      next(createError.NotFound(`Path not found: ${req.path}`));
    });
    app.use(errorHandler);

    return app;
  },
};
