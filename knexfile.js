const snakeCase = require("lodash.snakecase");
const deepCamelCase = require("./src/lib/util/deep-camelcase");
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
} = require("./src/config");

const defaultConfig = {
  client: "pg",
  connection: {
    host: DB_HOST,
    port: 5432,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  },
  pool: { min: 0, max: 30 },
  seeds: {
    directory: "./seeds/prod",
  },
  wrapIdentifier: (value, origImpl) => {
    if (value === "*") {
      return value;
    }
    return origImpl(snakeCase(value));
  },
  postProcessResponse: result => {
    if (!result) {
      return result;
    }
    if (Array.isArray(result)) {
      return result.map(row => deepCamelCase(row));
    }
    return deepCamelCase(result);
  },
};

const developmentConfig = {
  ...defaultConfig,
  seeds: {
    directory: ["./seeds/prod", "./seeds/dev"],
    sortDirsSeparately: true,
  },
};

module.exports = {
  development: developmentConfig,
  test: developmentConfig,
  staging: defaultConfig,
  production: defaultConfig,
};
