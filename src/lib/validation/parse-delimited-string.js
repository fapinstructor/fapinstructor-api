function parseDelimitedString({ delimitor = "," } = {}) {
  return this.transform(function(value, originalValue) {
    if (this.isType(value) && value !== null) {
      return value;
    }
    return originalValue.split(delimitor);
  });
}

module.exports = parseDelimitedString;
