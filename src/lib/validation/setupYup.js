const yup = require("yup");
const parseDelimitedString = require("./parse-delimited-string");
const validateArrayValueUniqueness = require("./validate-array-value-uniqueness");
const dedupeArray = require("./dedupe-array");

yup.addMethod(yup.array, "delimited", parseDelimitedString);
yup.addMethod(yup.array, "unique", validateArrayValueUniqueness);
yup.addMethod(yup.array, "dedupe", dedupeArray);
