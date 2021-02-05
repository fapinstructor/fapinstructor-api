function dedupeArray() {
  return this.transform(function(value, originalValue) {
    if (this.isType(value) && value !== null) {
      return Array.from(new Set(originalValue.map(v => v.toLowerCase())));
    }
    return value;
  });
}

module.exports = dedupeArray;
