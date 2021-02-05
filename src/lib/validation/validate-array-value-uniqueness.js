function validateArrayValueUniqueness() {
  return this.test("unique", "values must be unique", function(list = []) {
    return list.length === new Set(list).size;
  });
}

module.exports = validateArrayValueUniqueness;
