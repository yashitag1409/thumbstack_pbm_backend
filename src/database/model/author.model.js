const { model } = require("mongoose");

const AUTHORSCHEMA = require("../schema/author.schema");
const AUTHORMODEL = model("author", AUTHORSCHEMA);

module.exports = AUTHORMODEL;
