const createError = require("http-errors");
const authenticate = require("./authenticate");

function authorize(context, requiredPermissions) {
  authenticate(context);

  const userPermissions = context.user.permissions;

  if (
    requiredPermissions &&
    !requiredPermissions.every(
      permission => userPermissions.indexOf(permission) !== -1,
    )
  ) {
    throw createError.Forbidden("You are not authorized for this resource");
  }
}

module.exports = authorize;
