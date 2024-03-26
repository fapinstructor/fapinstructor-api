const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const {
  AUTH_JWT_AUDIENCE,
  AUTH_JWT_ISSUER,
  AUTH_JWKS_URI,
  AUTH_JWKS_REQUESTS_PER_MINUTE,
} = require("../../config");

const auth = ({ credentialsRequired = true } = {}) =>
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: AUTH_JWKS_REQUESTS_PER_MINUTE,
      jwksUri: AUTH_JWKS_URI,
    }),
    audience: AUTH_JWT_AUDIENCE,
    issuer: AUTH_JWT_ISSUER,
    algorithms: ["RS256"],
    credentialsRequired,
  });

module.exports = auth;
