const mapKeys = require("lodash.mapkeys");
const camelCase = require("lodash.camelcase");

function deepCamelCase(obj) {
  return mapKeys(obj, (value, key) => camelCase(key));
}

module.exports = deepCamelCase;
