const { model } = require("mongoose");

const CATEGORYSCHEMA = require("../schema/category.schema");
const CATEGORYMODEL = model("category", CATEGORYSCHEMA);

module.exports = CATEGORYMODEL;
