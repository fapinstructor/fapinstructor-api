/* eslint-disable */
const createError = require("http-errors");

module.exports = scopes => (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(
      new AuthenticationError("You are not authenticated for this resource"),
    );
  }

  if (
    scopes &&
    !scopes.every(scope => userPermissions.indexOf(permission) !== -1)
  ) {
  }

  const userScopes = req.user.scope.split(" ");
  if (!scopes.every(x => userScopes.includes(x))) {
    // return next(new UnauthorizedError("Insufficient scope"));
    return next(
      createError.Forbidden("You are not authorized for this resource"),
    );
  }

  return next();
};
