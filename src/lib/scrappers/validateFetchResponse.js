var createError = require("http-errors");

function validateFetchResponse(res) {
  if (res.status != 200) {
    const { status, url } = res;

    throw createError(status, url);
  }

  return res;
}

module.exports = validateFetchResponse;
